import axios from "axios";
const apiUrl = import.meta.env.VITE_SERVER_API_URL;

// Backend expects (from your controller):
// {
//   "message": "...",
//   "conversation": []
// }

// Backend returns:
// {
//   "success": true,
//   "data": { ...schema... }
// }

// So we’ll call it using axiosInstance beacause it’s pre-configured with baseURL

// Create an instance of Axios with default configurations
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
