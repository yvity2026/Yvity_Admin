import { uploadToS3 } from "@/lib/s3/upload";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileName, fileType, fileBuffer } = body;

    if (!fileName || !fileType || !fileBuffer) {
      return NextResponse.json(
        { error: "Invalid upload request" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const sizeInBytes = Buffer.byteLength(fileBuffer, "base64");

    if (sizeInBytes > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(fileBuffer, "base64");

    const result = await uploadToS3({
      file: buffer,
      fileName,
      mimeType: fileType,
      folder: "irdai-certificates",
    });

    return NextResponse.json({
      url: result.url,
      key: result.key,
    });

  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}