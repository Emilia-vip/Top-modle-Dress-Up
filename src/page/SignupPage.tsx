import { useContext, useState } from "react";
import MyTextInput from "../components/MyTextInput";
import apiClient from "../api/client";
import { type AuthResponse } from "../type";
import { AuthContext } from "../contexts/AuthContext";
import validateEmail from "../utils/validateEmail";
import { useNavigate } from "react-router";
import gubbeImage from "../assets/gröngala.png";
import gubbeImage1 from "../assets/darksin-galablue.png";
import validateUsername from "../utils/validateUsername";
import { isUsernameAvailable } from "../api/user";
import runway from "../assets/runway,new.png";

type SignupData = {
  username: string;
  phone: string;
  email: string;
  password: string;
};

function SignupPage() {
  const { saveLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupData>({
    username: "",
    phone: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

 
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const updateField = (key: keyof SignupData, value: string) => {
    setFormData({ ...formData, [key]: value });
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

  const [isLoading, setIsLoading] = useState(false);

  const submitRegister = async () => {
    setErrorMessage("");

    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!validateUsername(formData.username)) {
      setErrorMessage(
        "Username must be 3–20 characters and can only contain letters, numbers, dots or underscores"
      );
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
      console.error("Registration error:", error);

      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        setErrorMessage("Cannot connect to server. Check your internet connection and make sure the server is running.");
      } else if (error.response?.status === 409 || error.response?.status === 400) {
        setErrorMessage(error.response.data?.message || "Username or email already exists. Please try a different one.");
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div
  className="min-h-screen w-full flex items-center justify-center
             bg-cover bg-center md:bg-no-repeat md:bg-bottom px-2 py-4 md:px-0 md:py-0"
  style={{
    backgroundImage: `url(${runway})`,
    backgroundSize: "cover",
  }}
>
      <div
        className="rounded-xl md:rounded-2xl shadow-2xl shadow-black p-3 md:p-10 w-full max-w-xs md:max-w-sm flex flex-col gap-2 md:gap-4 mb-2 md:mb-0 flex-shrink-0"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-xl md:text-3xl font-light text-center mb-3 md:mb-6 text-white tracking-wider">
          Create account
        </h1>

        <label className="text-gray-300 text-sm md:text-base">Username</label>
        <MyTextInput
          value={formData.username}
          onChange={(e) => {
            updateField("username", e.target.value);
            setUsernameStatus("idle");
            setErrorMessage("");
          }}
          onBlur={() => checkUsername(formData.username)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Username"
        />

        {usernameStatus === "checking" && (
          <p className="text-xs md:text-sm text-gray-300">Checking username...</p>
        )}
        {usernameStatus === "available" && (
          <p className="text-xs md:text-sm text-green-500">Username is available</p>
        )}
        {usernameStatus === "taken" && (
          <p className="text-xs md:text-sm text-red-500">Username is already taken</p>
        )}

        <label className="text-gray-300 text-sm md:text-base">Phone</label>
        <MyTextInput
          value={formData.phone}
          onChange={(e) => {
            updateField("phone", e.target.value);
            setErrorMessage("");
          }}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Phone number"
        />

        <label className="text-gray-300 text-sm md:text-base">Email</label>
        <MyTextInput
          value={formData.email}
          onChange={(e) => {
            updateField("email", e.target.value);
            setErrorMessage("");
          }}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Email...."
        />

        <label className="text-gray-300 text-sm md:text-base">Password</label>
        <MyTextInput
          type="password"
          value={formData.password}
          onChange={(e) => {
            updateField("password", e.target.value);
            setErrorMessage("");
          }}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Password...."
        />

        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 md:p-3">
            <p className="text-red-200 text-xs md:text-sm text-center">{errorMessage}</p>
          </div>
        )}

        <button
          onClick={submitRegister}
          disabled={isLoading}
          className="w-full bg-gray-700 bg-opacity-20 hover:bg-gray-600 hover:bg-opacity-30 active:bg-gray-500 active:bg-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-3 rounded-full shadow-lg transition-all duration-300 mt-2 border border-gray-500 hover:border-white text-sm md:text-base touch-manipulation min-h-[44px]"
        >
          {isLoading ? "Skapar konto..." : "Sign up"}
        </button>
      </div>

      <div className="hidden md:flex items-center ml-4 flex-shrink-0">
        <img src={gubbeImage} alt="Gubbe" className="w-80 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-80 h-auto -ml-30" />
      </div>
    </div>
  );
}

export default SignupPage;
