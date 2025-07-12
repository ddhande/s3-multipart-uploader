import { UploadPartCommand } from "@aws-sdk/client-s3";
import s3Client from "../clients/s3Client.js";

const getUploadPartUtil = async (body) => {
  try {
    const { key, partNumber, uploadId } = body;

    // Prepare the input for UploadPartCommand
    const input = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_BUCKET_KEY}/${key}`,
      PartNumber: partNumber,
      UploadId: uploadId,
    };

    // Execute the UploadPartCommand to get the Upload Part
    const command = new UploadPartCommand(input);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error getting upload part:", error);
    throw error;
  }
};

export default getUploadPartUtil;
