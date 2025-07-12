import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../clients/s3Client.js";

const getPresignedUrlsUtil = async (body) => {
  try {
    const { partCounts, uploadId, key } = body;

    // Prepare promises for generating presigned URLs
    const promises = [];
    for (let index = 0; index < partCounts; index++) {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_BUCKET_KEY}/${key}`,
        UploadId: uploadId,
        PartNumber: index + 1, // Part numbers start at 1
      };

      // Create the UploadPartCommand for each part
      const command = new UploadPartCommand(params);

      const signedUrl = getSignedUrl(s3Client, command, {
        expiresIn: process.env.S3_PRESIGNED_URL_EXPIRATION,
      });
      promises.push(signedUrl);
    }

    // Resolve all promises to get the presigned URLs
    const signedUrls = await Promise.all(promises);
    return signedUrls;
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    throw error;
  }
};

export default getPresignedUrlsUtil;
