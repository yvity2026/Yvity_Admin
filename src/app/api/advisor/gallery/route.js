import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";
import { createAdminClient } from "@/lib/supabase/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generatePresignedUrl(originalUrl) {
  if (!originalUrl) return originalUrl;
  const keyMatch = originalUrl.match(/amazonaws\.com\/(.+)$/);
  if (keyMatch && keyMatch[1]) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: keyMatch[1],
      });
      // URL expires in 1 hour (3600 seconds)
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (e) {
      console.error("Failed to generate presigned URL:", e);
      return originalUrl;
    }
  }
  return originalUrl;
}

export async function GET(req) {
  try {
    const user = await getUser();
    if (!user?.token) return apiResponse("Unauthorized", false, 401);
    
    const supabase = createAdminClient();
    const { data: userRecord } = await supabase.from("users").select("id").filter("device_tokens", "cs", JSON.stringify([{ token: user.token }])).maybeSingle();
    
    if (!userRecord) return apiResponse("User not found", false, 404);

    const { data, error } = await supabase
      .from("advisor_gallery")
      .select("*")
      .eq("advisor_id", userRecord.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map over items to replace static URLs with presigned URLs
    const itemsWithPresignedUrls = await Promise.all(
      data.map(async (item) => {
        if (item.image_url) {
          item.image_url = await generatePresignedUrl(item.image_url);
        }
        return item;
      })
    );

    return apiResponse("Gallery retrieved", true, 200, itemsWithPresignedUrls);
  } catch (error) {
    return apiResponse("Error fetching gallery", false, 500, "", error);
  }
}

export async function POST(req) {
  try {
    const user = await getUser();
    if (!user?.token) return apiResponse("Unauthorized", false, 401);

    const supabase = createAdminClient();
    const { data: userRecord } = await supabase.from("users").select("id").filter("device_tokens", "cs", JSON.stringify([{ token: user.token }])).maybeSingle();
    
    if (!userRecord) return apiResponse("User not found", false, 404);

    const formData = await req.formData();
    const file = formData.get("image");
    const caption = formData.get("caption") || "";
    const category = formData.get("category") || "";
    
    if (!file) return apiResponse("Image file is required", false, 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const key = `advisor-gallery/${userRecord.id}/${fileName}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Removed ACL: "public-read" because the bucket enforces Object Ownership
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const { data, error } = await supabase
      .from("advisor_gallery")
      .insert({
        advisor_id: userRecord.id,
        image_url: imageUrl,
        caption,
        category,
        sort_order: 0,
        is_public: true,
      })
      .select()
      .single();

    if (error) throw error;

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: userRecord.id,
    });

    if (recalcResult.error) {
      console.error("recalculate_advisor_score failed after gallery upload:", recalcResult.error);
    }

    // Generate presigned URL for the returned newly created item
    if (data && data.image_url) {
      data.image_url = await generatePresignedUrl(data.image_url);
    }

    return apiResponse("Photo uploaded successfully", true, 201, data);
  } catch (error) {
    return apiResponse("Error uploading photo", false, 500, "", error);
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return apiResponse("ID is required", false, 400);

    const user = await getUser();
    if (!user?.token) return apiResponse("Unauthorized", false, 401);

    const supabase = createAdminClient();
    const { data: userRecord } = await supabase.from("users").select("id").filter("device_tokens", "cs", JSON.stringify([{ token: user.token }])).maybeSingle();
    
    if (!userRecord) return apiResponse("User not found", false, 404);

    const { data: galleryItem } = await supabase
      .from("advisor_gallery")
      .select("image_url")
      .eq("id", id)
      .eq("advisor_id", userRecord.id)
      .single();

    if (galleryItem?.image_url) {
      const keyMatch = galleryItem.image_url.match(/amazonaws\.com\/(.+)$/);
      if (keyMatch && keyMatch[1]) {
        try {
           await s3Client.send(new DeleteObjectCommand({
             Bucket: process.env.AWS_S3_BUCKET_NAME,
             Key: keyMatch[1]
           }));
        } catch (s3Err) {
           console.log("Failed to delete from S3:", s3Err);
        }
      }
    }

    const { error } = await supabase
      .from("advisor_gallery")
      .delete()
      .eq("id", id)
      .eq("advisor_id", userRecord.id);

    if (error) throw error;

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: userRecord.id,
    });

    if (recalcResult.error) {
      console.error("recalculate_advisor_score failed after gallery delete:", recalcResult.error);
    }

    return apiResponse("Photo deleted successfully", true, 200);
  } catch (error) {
    return apiResponse("Error deleting photo", false, 500, "", error);
  }
}

export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return apiResponse("ID is required", false, 400);

    const user = await getUser();
    if (!user?.token) return apiResponse("Unauthorized", false, 401);

    const supabase = createAdminClient();
    const { data: userRecord } = await supabase.from("users").select("id").filter("device_tokens", "cs", JSON.stringify([{ token: user.token }])).maybeSingle();
    
    if (!userRecord) return apiResponse("User not found", false, 404);

    const body = await req.json();
    const updateData = {};
    if (body.caption !== undefined) updateData.caption = body.caption;
    if (body.category !== undefined) updateData.category = body.category;

    const { data, error } = await supabase
      .from("advisor_gallery")
      .update(updateData)
      .eq("id", id)
      .eq("advisor_id", userRecord.id)
      .select()
      .single();

    if (error) throw error;

    // Presign URL before returning updated row
    if (data && data.image_url) {
      data.image_url = await generatePresignedUrl(data.image_url);
    }

    return apiResponse("Photo updated successfully", true, 200, data);
  } catch (error) {
    return apiResponse("Error updating photo", false, 500, "", error);
  }
}
