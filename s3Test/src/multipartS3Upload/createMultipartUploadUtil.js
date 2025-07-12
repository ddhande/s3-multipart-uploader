import { CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import s3Client from "../clients/s3Client.js";

const createMultipartUploadUtil = async (body) => {
  try {
    const { contentType, key, metadata } = body;
    // Prepare the input for CreateMultipartUploadCommand
    const input = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_BUCKET_KEY}/${key}`,
      ContentType: contentType,
      Metadata: metadata,
    };

    // Execute the CreateMultipartUploadCommand to create the Multi Part Upload
    const command = new CreateMultipartUploadCommand(input);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error creating multipart upload:", error);
    throw error;
  }
};

export default createMultipartUploadUtil;
