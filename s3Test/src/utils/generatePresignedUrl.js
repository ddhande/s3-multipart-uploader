import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../clients/s3Client.js";

const generatePresignedUrl = async (body) => {
  try {
    const { commandType, params } = body;

    let command;

    switch (commandType) {
      case "GetObject":
        command = new GetObjectCommand(params);
        break;

      case "PutObject":
        command = new PutObjectCommand(params);
        break;

      case "DeleteObject":
        command = new DeleteObjectCommand(params);
        break;

      case "CopyObject":
        command = new CopyObjectCommand(params);
        break;

      default:
        throw new Error(`Unsupported command type: ${commandType}`);
    }

    const url = await getSignedUrl(s3Client, command, { expiresIn: process.env.S3_PRESIGNED_URL_EXPIRATION });
    return url;
  } catch (error) {
    console.error(`Error generating presigned URL for ${commandType}:`, error);
    throw error;
  }
};

export default generatePresignedUrl;

