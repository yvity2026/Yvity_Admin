import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "./bucket";

export const uploadToS3 = async ({ file, fileName, mimeType, folder }) => {
  const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

  const key = `${folder}/${Date.now()}-${safeFileName}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
    },
  });

  try {
    await upload.done();
  } catch (err) {
    console.error("S3 upload failed:", err);
    throw new Error("File upload failed");
  }

  return {
    key,
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};
