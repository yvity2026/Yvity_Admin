import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (e) {
      console.error("Failed to generate presigned URL:", e);
      return originalUrl;
    }
  }
  return originalUrl;
}

/**
 * GET public advisor gallery by advisor ID
 * Used for public profile viewing
 */
export async function GET(request, context) {
  try {
    const params = await context.params;
    const advisorId = params?.advisorId;

    if (!advisorId) {
      return NextResponse.json(
        { error: "Advisor ID is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_gallery")
      .select("*")
      .eq("advisor_id", advisorId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Generate presigned URLs for images
    const itemsWithPresignedUrls = await Promise.all(
      (data || []).map(async (item) => {
        if (item.image_url) {
          item.image_url = await generatePresignedUrl(item.image_url);
        }
        return item;
      })
    );

    return NextResponse.json({
      success: true,
      data: itemsWithPresignedUrls,
    });
  } catch (error) {
    console.error("Error fetching public gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery", success: false },
      { status: 500 }
    );
  }
}
