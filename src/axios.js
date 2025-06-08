import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // this sends cookies or headers
});