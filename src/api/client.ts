import axios, { AxiosError } from "axios";
import { BASE_URL, REFRESH_TOKEN } from "../constants";

const apiClient = axios.create({
  baseURL: BASE_URL,
});
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    const orginalRequest = error.config
    if (error.response?.status === 401) {
      throw new Error("Error ocurred")
    }
     const refreshToken = localStorage.getItem(REFRESH_TOKEN)
    if (!refreshToken) {
      throw new Error("Auth error but no refresh token")
   }
  }
)

export default apiClient;







