import axios from "axios";

const api = axios.create({
  baseURL: "https://codealpha-eventregistration-9cay.onrender.com",
  timeout: 20000, // 20 seconds,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error?.response?.data.message || "An error occurred. Please try again.";
    error.message = customMessage;
    return Promise.reject(new Error(customMessage));
  },
);

export default api;
