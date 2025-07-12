import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  timeout: 50000,
});

// axiosInstance.interceptors.request.use(
//   (request) => {
//     // Log the request details here
//     console.log("Request URL:", request.url); // URL of the request
//     console.log("Request Method:", request.method); // HTTP method
//     console.log("Request Headers:", request.headers); // Headers of the request
//     console.log("Request Payload:", request.data); // Request body (payload)

//     // You can also return the request if everything is fine
//     return request;
//   },
//   (error) => {
//     // Handle request error
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
