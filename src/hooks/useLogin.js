import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
export const useLogin = () => {
    const { saveLogin } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const login = async () => {
        setErrorMessage("");
        if (!username || !password) {
            setErrorMessage("Please fill in all fields");
            return;
        }
        setIsLoading(true);
        try {
            const response = await apiClient.post("/login", {
                username,
                password,
            });
            saveLogin(response.data);
        }
        catch (error) {
            console.error("Login error:", error);
            if (error.code === 'ERR_NETWORK') {
                setErrorMessage("Cannot connect to server. Check your connection.");
            }
            else if (error.response?.status === 404) {
                setErrorMessage("User not found.");
            }
            else if (error.response?.status === 401) {
                setErrorMessage("Invalid password.");
            }
            else {
                setErrorMessage(error.response?.data?.message || "Login failed.");
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return {
        username,
        setUsername,
        password,
        setPassword,
        errorMessage,
        setErrorMessage,
        isLoading,
        login,
    };
};
