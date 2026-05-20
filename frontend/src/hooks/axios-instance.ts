import axios from "axios";

const api = axios.create({
  baseURL: "https://codealpha-eventregistration-9cay.onrender.com",
  timeout: 20000, // 20 seconds,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
