import { NextResponse } from "next/server";
import { S3_FOLDERS } from "@/lib/s3/Types";
import { uploadToS3 } from "@/lib/s3/upload";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(request) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") || formData.get("media");
  const kind = String(formData.get("kind") || "").trim().toLowerCase();

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ success: false, error: "Media file is required" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ success: false, error: "File type not allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ success: false, error: "File exceeds 20 MB limit" }, { status: 400 });
  }

  let folder = S3_FOLDERS.testimonial_audio;

  if (kind === "profile_image" || file.type?.startsWith("image/")) {
    folder = S3_FOLDERS.profile_pic;
  } else if (file.type?.startsWith("video/")) {
    folder = S3_FOLDERS.testimonial_video;
  }

  const upload = await uploadToS3({
    file: Buffer.from(await file.arrayBuffer()),
    fileName: file.name || "media",
    mimeType: file.type || "application/octet-stream",
    folder,
  });

  return NextResponse.json({ success: true, url: upload.url, data: upload });
}
