import axios from "axios";
import { API_URL } from "../config";
import tokenService from "../services/tokenService";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = API_URL || "http://localhost:4000";

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config) => {
    const { access_token } = await tokenService.getCredentials();
    config.headers = {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { access_token } = await tokenService.getCredentials();
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
