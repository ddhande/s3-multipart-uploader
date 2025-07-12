# 📁 Multipart File Upload System Design using S3

# Frontend Flow
1. ## Take File as Input

User selects a file via a file input.

Frontend reads file details like name, size, and type.

2. ## Create Chunks

The file is split into chunks (e.g., 5MB each).

Only metadata is prepared: total number of chunks, file name, chunk size.

Actual file data is not sent at this point.

3. ## Send Metadata to Backend

Frontend sends:

File name or key for storage in S3.

Chunk size.

Total chunk count.

# Backend Flow
4. ## Generate Presigned URLs

Backend:

Calls **CreateMultipartUpload** to initiate the upload and get an UploadId.

Creates presigned URLs for each part (using UploadId and PartNumber).

Backend responds with:

UploadId.

Array of presigned URLs for each chunk.

# Frontend Flow (Continued)
5. ## Upload Chunks to S3

Frontend uploads each chunk using its respective presigned URL.

On successful upload of a part, it receives an ETag in response.

Frontend stores a list of:

ETags (unique hash for each chunk).

PartNumbers (chunk index starting from 1).

6. Send ETags to Backend

After all uploads, frontend sends:

UploadId

Array of { PartNumber, ETag } for each uploaded chunk.

**Backend Flow (Final Step)**
7. Complete Multipart Upload

Backend:

Uses UploadId and the list of { PartNumber, ETag } to call **CompleteMultipartUpload**.

S3 assembles the parts into a final file.

Backend responds with:

Confirmation of success.

Final file location (S3 key or URL).

🧩 **Key Responsibilities**
# Frontend:
Handles chunking and reading the file.

Tracks successful uploads and ETags.

Handles retries for failed chunk uploads.

Communicates metadata and ETags to backend.

# Backend:
Manages the upload lifecycle with S3:

CreateMultipartUpload

GeneratePresignedUrl

CompleteMultipartUpload

Validates ETags and completes the process securely.

