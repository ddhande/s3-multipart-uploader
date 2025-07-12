import {
  getPresignedUrlsUtil,
  createMultipartUploadUtil,
  completeMultipartUploadUtil,
  listMultipartUploadUtil,
  listPartUploadUtil,
  abortMultipartUploadUtil,
} from "./src/multipartS3Upload/index.js";
import generatePresignedUrl from "./src/utils/generatePresignedUrl.js";
import createResponse from "./src/utils/response.js";

export const s3Operation = async (event) => {
  try {
    const { operation, filename, contentType } = JSON.parse(event.body);

    if (!operation || !filename) {
      return createResponse(
        400,
        false,
        "Missing required parameters (Operation or filename)."
      );
    }

    let commandType;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${process.env.S3_BUCKET_KEY}/${filename}`,
    };

    if (operation === "upload") {
      commandType = "PutObject";
      params.ContentType = contentType || "application/octet-stream";
    } else if (operation === "download") {
      commandType = "GetObject";
    } else if (operation === "delete") {
      commandType = "DeleteObject";
    } else {
      return createResponse(
        400,
        false,
        "Unsupported operation. Supported operations are 'upload', 'download', 'delete'."
      );
    }

    // Prepare the parameters to get Introspection Schema
    const s3Params = {
      commandType,
      params,
    };

    const data = await generatePresignedUrl(s3Params);

    // Return a success response
    return createResponse(
      200,
      true,
      `Presigned URL generated successfully for ${operation}`,
      data
    );
  } catch (error) {
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error generating presigned URL",
      null,
      error?.errors?.message || "An unexpected error occurred"
    );
  }
};

export const startMultipartUpload = async (event) => {
  try {
    const { fileMetadata, partCounts } = JSON.parse(event.body);

    // Check for the required fields
    if (!fileMetadata || !partCounts) {
      return createResponse(
        400,
        false,
        "Missing required parameters (fileMetadata and partCounts)."
      );
    }

    // Prepare the parameters to create multi part upload
    const createmultipartUploadParams = {
      contentType: fileMetadata.contentType,
      key: fileMetadata.name,
      metadata: fileMetadata,
    };

    // Call the utility function to create multi part upload
    const response = await createMultipartUploadUtil(
      createmultipartUploadParams
    );

    const uploadId = response.UploadId;

    if (!uploadId) {
      return createResponse(
        400,
        false,
        "Failed to create multipart upload (no UploadId returned)."
      );
    }

    // Prepare the parameters to get presigned urls
    const getPresignedUrlsParams = {
      partCounts,
      uploadId,
      key: fileMetadata.name,
    };

    const data = await getPresignedUrlsUtil(getPresignedUrlsParams);
    // Return a success response
    return createResponse(200, true, "Presigned urls generated successfully", {
      PresignedUrls: data,
      UploadId: uploadId,
    });
  } catch (error) {
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error generating presigned urls",
      null,
      error?.message || "An unexpected error occurred"
    );
  }
};

export const completeMultipartUpload = async (event) => {
  try {
    const { fileMetadata, uploadId } = JSON.parse(event.body);

    // Check for the required fields
    if (!uploadId || !fileMetadata) {
      return createResponse(
        400,
        false,
        "Missing required parameters (uploadId and fileMetadata)."
      );
    }

    // Step 1: Prepare parameters to list parts
    const listPartUploadParams = {
      key: fileMetadata.name,
      uploadId,
    };

    // Step 2: List the parts uploaded so far
    const listResponse = await listPartUploadUtil(listPartUploadParams);

    // Step 3: Collect all ETags from the parts list
    const etags = listResponse.Parts.map((part) => ({
      PartNumber: part.PartNumber,
      ETag: part.ETag,
    }));

    // Step 4: Prepare parameters for completing the multipart upload
    const completeMultipartUploadParams = {
      etags,
      uploadId,
      key: fileMetadata.name,
    };

    // Step 5: Call the utility function to complete the multipart upload
    const completeMultipartResponse = await completeMultipartUploadUtil(
      completeMultipartUploadParams
    );

    // Step 6: Return a success response indicating the upload is completed
    return createResponse(
      200,
      true,
      "Multipart upload completed successfully",
      completeMultipartResponse
    );
  } catch (error) {
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error completing multipart upload",
      null,
      error?.message || "An unexpected error occurred"
    );
  }
};

export const listMultipartUpload = async (event) => {
  try {
    const data = await listMultipartUploadUtil();

    // Return a success response
    return createResponse(
      200,
      true,
      "Multi part upload listed successfully",
      data
    );
  } catch (error) {
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error listing multipart upload",
      null,
      error?.message || "An unexpected error occurred"
    );
  }
};

export const listPartUpload = async (event) => {
  try {
    const { key, uploadId } = JSON.parse(event.body);

    // Check for the required fields
    if (!key || !uploadId) {
      return createResponse(
        400,
        false,
        "Missing required parameters (key & uploadId)."
      );
    }

    // Prepare the parameters to list multi part upload
    const listPartUploadParams = {
      key,
      uploadId,
    };

    const data = await listPartUploadUtil(listPartUploadParams);

    // Return a success response
    return createResponse(200, true, "Part upload listed successfully", data);
  } catch (error) {
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error listing part upload",
      null,
      error?.message || "An unexpected error occurred"
    );
  }
};

export const abortMultipartUpload = async (event) => {
  try {
    const { key, uploadId } = JSON.parse(event.body);

    // Check for the required fields
    if (!uploadId) {
      return createResponse(
        400,
        false,
        "Missing required parameters (name & uploadId)."
      );
    }

    // Prepare the parameters to abort multi part upload
    const abortMultipartUploadParams = {
      key,
      uploadId,
    };

    const data = await abortMultipartUploadUtil(abortMultipartUploadParams);

    // Return a success response
    return createResponse(
      200,
      true,
      "Multipart upload aborted successfully",
      data
    );
  } catch (error) {
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error aborting multipart upload",
      null,
      error?.message || "An unexpected error occurred"
    );
  }
};

export const abortAllMultipartUpload = async (event) => {
  try {
    // Step 1: List all the multipart uploads
    const data = await listMultipartUploadUtil();

    // Check if there are any uploads to abort
    if (!data.Uploads || data.Uploads.length === 0) {
      return createResponse(200, true, "No multipart uploads to abort", []);
    }

    // Step 2: Fetch the uploadId and Key
    const uploads = data.Uploads.map((upload) => ({
      uploadId: upload.UploadId,
      key: upload.Key,
    }));

    // Step 3: Call the abort multipart upload utility and pass on the uploads
    const abortUploadPromises = uploads.map(async (upload) => {
      // Prepare the parameters to abort multipart upload
      const abortMultipartUploadParams = {
        key: upload.key,
        uploadId: upload.uploadId,
      };

      // Call the abort multipart upload utility
      try {
        const result = await abortMultipartUploadUtil(
          abortMultipartUploadParams
        );
        return result; // Return the result of the abort operation
      } catch (abortError) {
        // Handle individual abort errors if needed
        console.error(
          `Failed to abort uploadId: ${upload.uploadId}`,
          abortError
        );
        return { uploadId: upload.uploadId, error: abortError.message }; // Return error details
      }
    });

    // Wait for all abort upload promises to resolve
    const results = await Promise.all(abortUploadPromises);

    // Filter out any errors from the results
    const successfulAborts = results.filter((result) => !result.error);
    const failedAborts = results.filter((result) => result.error);

    // Return a success response with details
    return createResponse(
      200,
      true,
      `Aborted ${successfulAborts.length} multipart uploads successfully. ${failedAborts.length} failed.`,
      results
    );
  } catch (error) {
    // Handle errors from the listMultipartUploadUtil call
    return createResponse(
      error?.$metadata?.httpStatusCode || 500,
      false,
      "Error aborting multipart uploads",
      null,
      error?.message || "An unexpected error occurred"
    );
  }
};
