import { uploadToS3 } from "@/lib/s3/upload";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const body = await req.json();

    const { fileName, fileType, fileBuffer } = body;

    const buffer = Buffer.from(fileBuffer);

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
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}