import { getUint8Array } from "./uint8BitArray";

export interface FileMetadata {
  name: string;
  contentType: string;
}

export interface ChunkFileResult {
  chunks: Blob[];
  chunkCount: number;
  fileMetadata: FileMetadata;
}

export const chunkFile = async (file: File, chunkSizeMB: number): Promise<ChunkFileResult> => {
  const chunkSize = chunkSizeMB * 1024 * 1024; // Convert MB to bytes
  const chunks: Blob[] = [];
  let start = 0;

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size);
    const blobChunk = file.slice(start, end);

    // Convert Blob to Uint8Array
    const uint8ArrayChunk = await getUint8Array(blobChunk);
    
    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8ArrayChunk], { type: file.type });
    chunks.push(blob);

    start = end;
  }

  return {
    chunks,
    chunkCount: chunks.length,
    fileMetadata: {
      name: file.name,
      contentType: file.type,
    },
  };
};
