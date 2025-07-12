**Note: To upload the file, successfully update both Frontend and Backend environment files with valid AWS credentials.**
# 🗂️ Project: Multipart File Upload to AWS S3 (Presigned URLs)
# 📌 Overview
This project implements a robust file upload system that uploads large files in multiple chunks to Amazon S3 using presigned URLs. It ensures reliability, incorporates retry mechanisms, and optimizes performance for handling large file uploads in a scalable and secure manner.

🔧 Tech Stack
Frontend: React / TypeScript / Vite

Backend: Node.js / Serverless / AWS SDK

Cloud Storage: Amazon S3 (with multipart upload & presigned URLs)

# 📁 Features
Chunk file uploads on the frontend (configurable chunk size)

Metadata exchange before upload

Presigned URL generation for secure upload

ETag collection for each chunk

Completion of a multipart upload

Retry support for failed chunks

# 📈 Flow Summary
# Frontend
Select File
Reads and displays file details.

Chunk the File
The file is divided into 5MB (default) chunks.

Send Metadata to Backend
Sends total chunks, filename, and chunk size.

Upload Chunks to S3
Uses presigned URLs to upload chunks and stores ETags.

Send ETags to the Backend
Sends a list of { PartNumber, ETag } after all chunks are uploaded.

# Backend
Initiate Multipart Upload
Gets UploadId and generates presigned URLs.

Respond with Presigned URLs
One URL per chunk with part number.

Complete Multipart Upload
Finalizes the upload with UploadId and ETags.

# 🔐 Security Considerations
Presigned URLs are time-limited and access-controlled.

No file is ever uploaded directly to the backend server.

Multipart upload allows resuming from failed parts without restarting the entire upload.

# ⚙️ Configuration Options
Chunk Size: Default 5MB, can be adjusted in frontend config.

S3 Bucket: Set in environment variables.

Presigned URL Expiry: Default 15 minutes.

# 📂 API Endpoints
POST /startMultipartUpload
Description: Starts a multipart upload, returns UploadId & presigned URLs.

Body:
{
 fileMetadata: {
    name: "example.pdf";
    contentType: 'application/pdf';
  };
  partCounts: 10;
}

POST /CompleteMultipartUpload
Description: Completes a multipart upload using UploadId and ETags.

Body:
{
  "uploadId": "abc123",
  "fileName": "example.pdf",
  "parts": [
    { "PartNumber": 1, "ETag": "etag1" },
    { "PartNumber": 2, "ETag": "etag2" }
  ]
}

# 📦 How to Run
**Backend**
npm install
npm start

**Frontend**
npm install
npm run dev


# 📋 Future Enhancements
Support for pausing/resuming uploads

Retry queue and progress bar on the frontend

Lambda backend (for serverless deployment)
