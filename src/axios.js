import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_BACKED_URL || 'http://localhost:3000',
  withCredentials: true, // this sends cookies or headers
});