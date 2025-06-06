import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API base URL
withCredentials: true, // Include credentials in requests
});
