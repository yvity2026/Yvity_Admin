import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "./bucket";


export const uploadToS3 = async ({
  file,
  fileName,
  mimeType,
  folder,
}) => {
  const key = `${folder}/${Date.now()}-${fileName}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: mimeType,
    },
  });

  await upload.done();

  return {
    key,
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};