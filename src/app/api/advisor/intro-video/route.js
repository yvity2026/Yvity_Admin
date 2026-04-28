import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getUser } from "@/lib/auth/Getuser";
import { apiResponse } from "@/lib/apiResponse";
import { recordAdvisorLoginActivity } from "@/lib/advisor-score/recordAdvisorLoginActivity";
import { createAdminClient } from "@/lib/supabase/server";
import { ValidateUser } from "@/lib/auth/ValidateUser";

const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;
const ACCEPTED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/x-msvideo",
]);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function getS3KeyFromUrl(url) {
  if (!url) return null;

  const keyMatch = url.match(/amazonaws\.com\/(.+)$/);
  return keyMatch?.[1] ?? null;
}

function isAcceptedVideo(file) {
  if (!file) return false;

  if (ACCEPTED_VIDEO_TYPES.has(file.type)) {
    return true;
  }

  return /\.(mp4|webm|mov|m4v|avi)$/i.test(file.name || "");
}

export async function POST(req) {
  try {
    const user = await ValidateUser();

    if (!user.device_tokens[0]?.token) {
      return apiResponse("Unauthorized", false, 401, "", "Unauthorized");
    }

    const supabase = createAdminClient();
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id, roles")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.device_tokens[0]?.token }]))
      .maybeSingle();

    if (userError || !userRecord) {
      return apiResponse(
        "User not found",
        false,
        404,
        "",
        userError?.message || "User not found"
      );
    }

    if (!Array.isArray(userRecord.roles) || !userRecord.roles.includes("advisor")) {
      return apiResponse("Unauthorized", false, 403, "", "Advisor access required");
    }

    await recordAdvisorLoginActivity(supabase, userRecord);

    const formData = await req.formData();
    const file = formData.get("video");

    if (!file || typeof file.arrayBuffer !== "function") {
      return apiResponse("Video file is required", false, 400, "", "Missing video file");
    }

    if (!isAcceptedVideo(file)) {
      return apiResponse(
        "Unsupported video format",
        false,
        400,
        "",
        "Upload MP4, MOV, WEBM, AVI, or M4V video files"
      );
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return apiResponse(
        "Video file is too large",
        false,
        400,
        "",
        "Video must be 50MB or smaller"
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("advisor_profiles")
      .select("advisor_id, intro_url")
      .eq("advisor_id", userRecord.id)
      .maybeSingle();

    if (profileError || !profile) {
      return apiResponse(
        "Advisor profile not found",
        false,
        404,
        "",
        profileError?.message || "Advisor profile not found"
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const sanitizedName = (file.name || "intro-video.mp4").replace(/[^a-zA-Z0-9._-]/g, "");
    const fileName = `${Date.now()}-${sanitizedName}`;
    const key = `advisor-intro-videos/${userRecord.id}/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "video/mp4",
      })
    );

    const introUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const { data: updatedProfile, error: updateError } = await supabase
      .from("advisor_profiles")
      .update({
        intro_url: introUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("advisor_id", userRecord.id)
      .select("*")
      .single();

    if (updateError) {
      return apiResponse("Failed to save intro video", false, 500, "", updateError.message);
    }

    const oldKey = getS3KeyFromUrl(profile.intro_url);
    if (oldKey && oldKey !== key) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: oldKey,
          })
        );
      } catch (deleteError) {
        console.error("Failed to delete previous intro video", deleteError);
      }
    }

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: userRecord.id,
    });

    if (recalcResult.error) {
      console.error("recalculate_advisor_score failed", recalcResult.error);
    }

    const { data: scoreRow, error: scoreError } = await supabase
      .from("advisor_scores")
      .select("*")
      .eq("advisor_id", userRecord.id)
      .maybeSingle();

    if (scoreError) {
      console.error("Failed to fetch advisor_scores after intro upload", scoreError);
    }

    return apiResponse("Intro video uploaded successfully", true, 200, {
      profile: updatedProfile,
      score: scoreRow ?? null,
    });
  } catch (error) {
    console.error("POST /api/advisor/intro-video error:", error);
    return apiResponse("Error uploading intro video", false, 500, "", error);
  }
}
