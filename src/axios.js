// axiosInstance.js
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  withCredentials: true,
});
