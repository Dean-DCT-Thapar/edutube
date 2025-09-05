// utils/apiClient.js
import axios from 'axios';
import { getBackendUrl } from './apiConfig';

// Create a reusable Axios instance for backend communication
const apiClient = axios.create({
    baseURL: getBackendUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging in development
if (process.env.NODE_ENV === 'development') {
    apiClient.interceptors.request.use(
        (config) => {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
            return config;
        },
        (error) => {
            console.error('API Request Error:', error);
            return Promise.reject(error);
        }
    );
}

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });
        return Promise.reject(error);
    }
);

export default apiClient;
