import { S3Client } from "@aws-sdk/client-s3";

const config = {
  region: process.env.S3_BUCKET_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3,
  },
  useAccelerateEndpoint: true
}

const s3Client = new S3Client(config);

export default s3Client;
