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

    try {
      const response = await apiClient.post<AuthResponse>("/sign_up", formData);
      saveLogin(response.data);
      navigate("/");

    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
        
      } else {
        setErrorMessage("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-start px-10 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://t3.ftcdn.net/jpg/09/00/33/46/360_F_900334673_iPcSROckgtgBmsRh3WiUENMKxsnmfEBW.jpg')",
      }}
    >
      <div
        className="rounded-2xl shadow-2xl shadow-black p-10 w-full max-w-sm flex flex-col gap-4"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-3xl font-light text-center mb-6 text-white tracking-wider">
          Create account
        </h1>

        <label className="text-gray-300">Username</label>
        <MyTextInput
          value={formData.username}
          onChange={(e) => {
            updateField("username", e.target.value);
            setUsernameStatus("idle");
          }}
          onBlur={() => checkUsername(formData.username)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Username"
        />

        {usernameStatus === "checking" && (
          <p className="text-sm text-gray-300">Checking username...</p>
        )}
        {usernameStatus === "available" && (
          <p className="text-sm text-green-500">Username is available</p>
        )}
        {usernameStatus === "taken" && (
          <p className="text-sm text-red-500">Username is already taken</p>
        )}

        <label className="text-gray-300">Phone</label>
        <MyTextInput
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Phone number"
        />

        <label className="text-gray-300">Email</label>
        <MyTextInput
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Email...."
        />

        <label className="text-gray-300">Password</label>
        <MyTextInput
          type="password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Password...."
        />

        {errorMessage && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}

        <button
          onClick={submitRegister}
          className="w-full bg-gray-700 bg-opacity-20 hover:bg-gray-600 hover:bg-opacity-30 text-white font-semibold py-3 rounded-full shadow-lg transition-all duration-300 mt-2 border border-gray-500 hover:border-white"
        >
          Sign up
        </button>
      </div>

      <div className="flex items-center ml-4">
        <img src={gubbeImage} alt="Gubbe" className="w-80 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-80 h-auto -ml-30" />
      </div>
    </div>
  );
}

export default SignupPage;
