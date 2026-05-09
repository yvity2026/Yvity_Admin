import { NextResponse } from "next/server";
import { S3_FOLDERS } from "@/lib/s3/Types";
import { uploadToS3 } from "@/lib/s3/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file") || formData.get("media");

  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ success: false, error: "Media file is required" }, { status: 400 });
  }

  const upload = await uploadToS3({
    file: Buffer.from(await file.arrayBuffer()),
    fileName: file.name || "media",
    mimeType: file.type || "application/octet-stream",
    folder: file.type?.startsWith("video/")
      ? S3_FOLDERS.testimonial_video
      : S3_FOLDERS.testimonial_audio,
  });

  return NextResponse.json({ success: true, url: upload.url, data: upload });
}
