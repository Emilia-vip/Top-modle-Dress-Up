import axios from "axios";
import { BASE_URL, REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
const apiClient = axios.create({
    baseURL: BASE_URL,
});
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        return Promise.reject(error);
    }
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
        return Promise.reject(error);
    }
    return Promise.reject(error);
});
export default apiClient;
