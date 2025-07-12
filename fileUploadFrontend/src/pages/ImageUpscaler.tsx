import { useState } from "react"; 
import axios from "axios"; 

const ImageUpscaler = () => { 
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [isUpscalling, setIsUpscalling] = useState(false); 
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null); 

  // Handle file input change 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files ? event.target.files[0] : null; 
    if (file) { 
      setSelectedFile(file); 
    } 
  }; 

  // Handle form submission and API call
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { 
    event.preventDefault(); 

    if (!selectedFile) { 
      alert("Please select an image first."); 
      return; 
    }

    setIsUpscalling(true);

    // Create FormData to send the file to the server
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Call the backend API to upscale the image
      const response = await axios.post("/upscaleImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress((progressEvent.loaded / progressEvent.total) * 100);
          }
        },
      });

      // Set the download URL once the image is processed
      setDownloadUrl(response.data.downloadUrl);
    } catch (error) {
      console.error("Error upscaling image:", error);
      alert("Failed to upscale image.");
    } finally {
      setIsUpscalling(false);
    }
  }; 

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  return ( 
    <> 
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center mb-3 my-2">
        <label htmlFor="formFile" className="mb-2 inline-block text-black"> 
          Upload an Image here 
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
          disabled={isUpscalling}
        >
          {isUpscalling ? "Upscaling..." : "Upscale"}
        </button>
      </form>

      {isUpscalling && (
        <div className="progress-bar mt-4 w-full max-w-lg bg-gray-200 h-2 rounded">
          <div
            className="progress-bar-fill bg-blue-500 h-2 rounded"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {downloadUrl && (
        <button
          onClick={handleDownload}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Download Upscaled Image
        </button>
      )}
    </> 
  ); 
};

export default ImageUpscaler;
