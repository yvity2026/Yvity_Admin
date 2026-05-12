import { NextResponse } from "next/server";
import { S3_FOLDERS } from "@/lib/s3/Types";
import { uploadToS3 } from "@/lib/s3/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file") || formData.get("media");
  const kind = String(formData.get("kind") || "").trim().toLowerCase();

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ success: false, error: "Media file is required" }, { status: 400 });
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
