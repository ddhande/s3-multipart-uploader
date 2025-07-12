import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";

export interface getPresignedUrlPayload {
  filename: string;
  operation: string;
}

export interface getPresignedUrlResponse {
  success: boolean;
  data: string; // Presigned url
  message?: string; // Optional message
}

export const s3OperationAPI = async (
  payload: getPresignedUrlPayload
): Promise<getPresignedUrlResponse> =>
  axiosInstance
    .post<getPresignedUrlResponse>("/s3Operation", payload)
    .then((res) => res.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response from server:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    });
