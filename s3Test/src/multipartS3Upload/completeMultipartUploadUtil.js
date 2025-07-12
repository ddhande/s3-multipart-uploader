import { CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import s3Client from "../clients/s3Client.js";

const completeMultipartUploadUtil = async (body) => {
  try {
    const { uploadId, etags, key } = body;

    // Prepare the parts array for the CompleteMultipartUploadCommand
    const parts = etags.map(({ PartNumber, ETag }) => ({
      PartNumber,
      ETag,
    }));

    // Prepare the input for the CompleteMultipartUploadCommand
    const input = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_BUCKET_KEY}/${key}`,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };

    // Execute the CompleteMultipartUploadCommand
    const command = new CompleteMultipartUploadCommand(input);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    throw error;
  }
};

export default completeMultipartUploadUtil;
