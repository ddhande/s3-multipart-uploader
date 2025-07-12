import { ListMultipartUploadsCommand } from "@aws-sdk/client-s3";
import s3Client from "../clients/s3Client.js";

const listMultipartUploadUtil = async () => {
  try {
    // Prepare the input for ListMultipartUploadsCommand
    const input = {
      Bucket: process.env.S3_BUCKET_NAME,
    };

    // Execute the ListMultipartUploadsCommand to list the Multi Part Upload
    const command = new ListMultipartUploadsCommand(input);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error listing multipart upload:", error);
    throw error;
  }
};

export default listMultipartUploadUtil;
