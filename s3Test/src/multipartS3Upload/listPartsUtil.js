import { ListPartsCommand } from "@aws-sdk/client-s3";
import s3Client from "../clients/s3Client.js";

const listPartUploadUtil = async (body) => {
  try {
    const { key, uploadId } = body;

    // Prepare the input for ListPartsCommand
    const input = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_BUCKET_KEY}/${key}`,
      UploadId: uploadId,
    };

    // Execute the ListPartsCommand to list the Part Upload
    const command = new ListPartsCommand(input);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error listing part upload:", error);
    throw error;
  }
};

export default listPartUploadUtil;
