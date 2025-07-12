import "./App.css";
import { useState } from "react";
import { chunkFile } from "./utils/chunkFile";
import { completeMultipartUploadAPI } from "./services/completeMultipartUploadAPI";
import { startMultipartUploadAPI } from "./services/startMultipartUploadAPI";
import { uploadChunks } from "./utils/uploadChunks";
import SuccessBar from "./components/SuccessBar";
import { s3OperationAPI } from "./services/s3OperationAPI";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Chunk the file into 100 MB parts
      const { chunks, chunkCount, fileMetadata } = await chunkFile(
        selectedFile,
        50
      );

      // Step 2: Prepare payload for the `startMultipartUpload` API
      const startPayload = {
        fileMetadata,
        partCounts: chunkCount,
      };

      // Step 3: Call the `startMultipartUpload` API using the service
      const { presignedUrls, uploadId } = await startMultipartUploadAPI(
        startPayload
      );

      // version: 1 serial upload
      // Step 4: Upload each chunk using its corresponding pre-signed URL

      // for (let i = 0; i < chunks.length; i++) {
      //   const chunk = chunks[i];
      //   const url = presignedUrls[i];

      //   const uploadResponse = await fetch(url, {
      //     method: "PUT",
      //     body: chunk,
      //     headers: {
      //       "Content-Type": "application/octet-stream",
      //     },
      //   });

      //   if (!uploadResponse.ok) {
      //     const errorText = await uploadResponse.text();
      //     throw new Error(`Failed to upload chunk: ${errorText}`);
      //   }
      // }

      // version: 2 parallel upload with parallel limit
      // Step 4: Upload each chunk using its corresponding pre-signed URL

      // const pLimit = (concurrency: any) => {
      //   const tasks:any = [];
      //   let active = 0;
      
      //   const runNext = () => {
      //     if (tasks.length === 0 || active >= concurrency) {
      //       return;
      //     }
      
      //     active++;
      //     const { fn, resolve, reject } = tasks.shift();
      //     fn()
      //       .then(resolve)
      //       .catch(reject)
      //       .finally(() => {
      //         active--;
      //         runNext();
      //       });
      //   };
      
      //   return (fn: any) =>
      //     new Promise((resolve, reject) => {
      //       tasks.push({ fn, resolve, reject });
      //       runNext();
      //     });
      // };
      
      // const concurrencyLimit = 5; // Limit the number of concurrent uploads
      // const limit = pLimit(concurrencyLimit);
      
      // const uploadPromises = chunks.map((chunk, i) => {
      //   const url = presignedUrls[i];
      
      //   return limit(() =>
      //     fetch(url, {
      //       method: "PUT",
      //       body: chunk,
      //       headers: {
      //         "Content-Type": "application/octet-stream",
      //       },
      //     }).then((response) => {
      //       if (!response.ok) {
      //         throw new Error(`Failed to upload chunk ${i + 1}: ${response.statusText}`);
      //       }
      //       return response; // Optionally return the response
      //     })
      //   );
      // });
      
      // try {
      //   const uploadResponses = await Promise.all(uploadPromises);
      //   console.log("All chunks uploaded successfully:", uploadResponses);
      // } catch (error) {
      //   console.error("Error during chunk uploads:", error);
      //   throw error;
      // }
      

      // version: 3 parallel upload with retry mechanism
      // Step 4: Upload each chunk using its corresponding pre-signed URL

      await uploadChunks(chunks, presignedUrls, 5, 3, 1000, setUploadProgress);

      
      // Step 5: Prepare payload for the `completeMultipartUpload` API
      const completePayload = {
        uploadId,
        fileMetadata,
      };

      // Step 6: Call the `completeMultipartUpload` API using the service
      const completeResponse = await completeMultipartUploadAPI(
        completePayload
      );
      console.log("Upload completed successfully:", completeResponse);
      alert("File uploaded successfully.");

      // Step 7: Get the PresignedUrl of Uploaded file to download
      const s3OperationPayload = {
        filename: fileMetadata.name,
        operation: "download",
      };

      const s3OperationResponse = await s3OperationAPI(s3OperationPayload);
      console.log("s3OperationResponse: ", s3OperationResponse);
      const presignedUrl = s3OperationResponse.data;
      setDownloadUrl(presignedUrl); // Set the download URL

    } catch (error) {
      console.error("Error during multipart upload process:", error);
      alert("Failed to upload the file.");
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank"); // Open the presigned URL in a new tab
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center mb-3  my-2"
      >
        <label htmlFor="formFile" className="mb-2 inline-block text-black">
          Input a file here
        </label>
        <input
          className="relative block w-1/5 min-w-0 flex-auto rounded border border-neutral-300 bg-clip-padding px-3 py-1 text-base text-neutral-700 transition duration-300 ease-in-out file:bg-neutral-100 file:px-3 file:py-1 file:text-neutral-700 focus:border-primary focus:text-neutral-700"
          type="file"
          id="formFile"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isUploading }
        >
         {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {downloadUrl && (
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Download File
        </button>
      )}

      {/* Render the SuccessBar component and pass the upload progress */}
      <SuccessBar progress={uploadProgress} />
      
    </>
  );
}

export default App;
