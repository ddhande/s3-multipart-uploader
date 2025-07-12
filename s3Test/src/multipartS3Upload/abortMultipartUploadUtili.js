import { AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import s3Client from "../clients/s3Client.js";

const abortMultipartUploadUtil = async (body) => {
  try {
    const { key, uploadId } = body;

    // Prepare the input for AbortMultipartUploadCommand
    const input = {
      Bucket: process.env.S3_BUCKET_NAME,
      // Key: `${process.env.S3_BUCKET_KEY}/${key}`,
      Key: `${key}`,
      UploadId: uploadId,
    };

    // Execute the AbortMultipartUploadCommand to abort the multipart Upload
    const command = new AbortMultipartUploadCommand(input);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error aborting multipart upload:", error);
    throw error;
  }
};

export default abortMultipartUploadUtil;
