import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/client";
import { isUsernameAvailable } from "../api/user";
import validateEmail from "../utils/validateEmail";
import validateUsername from "../utils/validateUsername";
import type { AuthResponse } from "../type";

export const useSignup = () => {
  const { saveLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "username") setUsernameStatus("idle");
    setErrorMessage("");
  };

  const checkUsername = async (username: string) => {
    if (!validateUsername(username)) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    try {
      const available = await isUsernameAvailable(username);
      setUsernameStatus(available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  };

  const submitRegister = async () => {
    setErrorMessage("");

    if (!Object.values(formData).every(val => val.trim())) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!validateUsername(formData.username)) {
      setErrorMessage("Username must be 3–20 characters (letters, numbers, dots, underscores)");
      return;
    }

    if (usernameStatus === "taken") {
      setErrorMessage("Username is already taken");
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthResponse>("/sign_up", formData);
      saveLogin(response.data);
      navigate("/");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed. Check your connection.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errorMessage,
    isLoading,
    usernameStatus,
    updateField,
    checkUsername,
    submitRegister
  };
};