import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";

export interface CompleteMultipartUploadPayload {
  fileMetadata: {
    name: string;
    contentType: string;
  };
  uploadId: string;
}

export interface CompleteMultipartUploadResponse {
  success: boolean;
  location: string; // URL or S3 location of the uploaded file
  message?: string; // Optional message
}

export const completeMultipartUploadAPI = async (
  payload: CompleteMultipartUploadPayload
): Promise<CompleteMultipartUploadResponse> =>
  axiosInstance
    .post<CompleteMultipartUploadResponse>("/completeMultipartUpload", payload)
    .then((res) => res.data)
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response from server:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    });

// completeMultipartUpload.ts v2
// import { axiosInstance } from "../utils/axiosInstance";

// export interface CompleteMultipartUploadPayload {
//   uploadId: string;
//   parts: { PartNumber: number; ETag: string }[];
//   fileMetadata: { name: string; size: number; contentType: string };
// }

// export interface CompleteMultipartUploadResponse {
//   success: boolean;
//   message: string;
//   data: any; // Adjust based on backend specifics
// }

// export const completeMultipartUploadAPI = async (
//   payload: CompleteMultipartUploadPayload
// ): Promise<CompleteMultipartUploadResponse> => {
//   try {
//     const response = await axiosInstance.post(
//       "/completeMultipartUpload",
//       payload
//     );

//     if (response.data?.success) {
//       return response.data;
//     }

//     throw new Error(
//       response.data?.message || "Failed to complete multipart upload"
//     );
//   } catch (error) {
//     console.error("Error in completeMultipartUploadAPI:", error);
//     throw error;
//   }
// };
