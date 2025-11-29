import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getAuthToken, logoutAuth } from "./auth";


console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

// Create axios instance
const ApiFetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor → Attach JWT if available
ApiFetcher.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor → Handle Unauthorized (401)
ApiFetcher.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      logoutAuth();
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default ApiFetcher;
