import { retryFetch } from "./retryFetch";
import { pLimit } from "./pLimit";

export const uploadChunks = async (
  chunks: Blob[], // Chunks as Blob
  presignedUrls: string[],
  concurrencyLimit = 5,
  retries = 3,
  retryDelay = 1000,
  setUploadProgress: (progress: number) => void // New parameter for updating progress
) => {
  const limit = pLimit(concurrencyLimit); // Create concurrency limit
  let uploadedCount = 0; // Counter for successfully uploaded chunks

  // Map each chunk upload to a controlled promise
  const uploadPromises = chunks.map((chunk, i) =>
    limit(() =>
      retryFetch(
        presignedUrls[i],
        {
          method: "PUT",
          // body: new Blob([chunk], { type: "application/octet-stream" }), // Convert Uint8Array to Blob
          body: chunk, // Convert Uint8Array to Blob
          headers: {
            "Content-Type": "application/octet-stream",
          },
        },
        retries,
        retryDelay
      ).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to upload chunk ${i + 1}: ${response.statusText}`);
        }
        console.log(`Chunk ${i + 1} uploaded successfully`);

         // Increment the uploaded count
         uploadedCount++;

        // Update the progress based on the uploaded count
        const progress = Math.round((uploadedCount / chunks.length) * 100);
        setUploadProgress(progress); // Update the progress

        return response;
      })
    )
  );

  try {
    const uploadResponses = await Promise.all(uploadPromises);
    console.log("All chunks uploaded successfully:", uploadResponses);
    return uploadResponses;
  } catch (error) {
    console.error("Error during chunk uploads:", error);
    throw error;
  }
};
