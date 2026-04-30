import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3/upload";

/**
 * POST /api/upload/media
 * Upload media files to S3 for testimonials (audio/video)
 * Only used for audio and video testimonials
 * Text testimonials don't require S3 upload
 * 
 * Expects: FormData with file
 * Returns: { success: true, url: "s3-url", key: "s3-key" }
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const mediaType = formData.get("mediaType"); // 'audio' or 'video'

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (!mediaType || !["audio", "video"].includes(mediaType)) {
      return NextResponse.json(
        { error: "Valid mediaType (audio or video) is required" },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for video, 10MB for audio)
    const maxSize = mediaType === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    const validAudioMimes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/webm"];
    const validVideoMimes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    const validMimes =
      mediaType === "audio" ? validAudioMimes : validVideoMimes;

    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid ${mediaType} format. Supported formats: ${validMimes.join(", ")}` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const { url, key } = await uploadToS3({
      file: buffer,
      fileName: file.name,
      mimeType: file.type,
      folder: `testimonials/${mediaType}s`,
    });

    return NextResponse.json(
      {
        success: true,
        url,
        key,
        message: "File uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to upload file",
        success: false,
      },
      { status: 500 }
    );
  }
}
