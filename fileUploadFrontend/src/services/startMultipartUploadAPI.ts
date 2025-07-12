// import { axiosInstance } from "../utils/axiosInstance";
// import axios from "axios";

export interface StartMultipartUploadPayload {
  fileMetadata: {
    name: string;
    contentType: string;
  };
  partCounts: number;
}

// export interface StartMultipartUploadResponse {
//   uploadId: string;
//   presignedUrls: string[];
// }

// export const startMultipartUploadAPI = async (
//   payload: StartMultipartUploadPayload
// ): Promise<StartMultipartUploadResponse> =>
//   axiosInstance
//     .post<StartMultipartUploadResponse>("/startMultipartUpload", payload)
//     .then((res) => res.data)
//     .catch((error) => {
//       if (axios.isAxiosError(error) && error.response) {
//         console.error("Error response from server:", error.response.data);
//       } else {
//         console.error("Unexpected error:", error);
//       }
//       throw error;
//     });

// startMultipartUpload.ts v2
import { axiosInstance } from "../utils/axiosInstance";

export interface StartMultipartUploadResponse {
  presignedUrls: string[];
  uploadId: string;
}

export const startMultipartUploadAPI = async (
  payload: StartMultipartUploadPayload
): Promise<StartMultipartUploadResponse> => {
  try {

    const response = await axiosInstance.post("/startMultipartUpload", payload);

    if (response.data?.success) {
      const { PresignedUrls: presignedUrls, UploadId: uploadId } = response.data.data;
      return { presignedUrls, uploadId };
    }

    throw new Error(
      response.data?.message || "Failed to start multipart upload"
    );
  } catch (error) {
    console.error("Error in startMultipartUploadAPI:", error);
    throw error;
  }
};
