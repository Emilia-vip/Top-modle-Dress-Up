import axios from "axios";
import MyTextInput from "../components/MyTextInput";
import { useContext, useState } from "react";
import type { AuthResponse } from "../type";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "../constants";
import { useNavigate } from "react-router";
import '../index.css';
import gubbeImage from "../assets/gröngala.png";
import gubbeImage1 from "../assets/darksin-galablue.png"
import runway from "../assets/runway,new.png";

function LoginPage() {
  const { saveLogin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      const response = await axios.post<AuthResponse>(`${BASE_URL}/login`, {
        username,
        password,
      });

      saveLogin(response.data);
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        setErrorMessage("Cannot connect to server. Check your internet connection and make sure the server is running.");
      } else if (error.response?.status === 404) {
        setErrorMessage("User not found. Please check your username.");
      } else if (error.response?.status === 401) {
        setErrorMessage("Invalid password. Please try again.");
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
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
      <form
        onSubmit={handleSubmit}
        className="rounded-xl md:rounded-2xl shadow-2xl shadow-black p-3 md:p-10 w-full max-w-xs md:max-w-sm flex flex-col gap-2 md:gap-4 mb-2 md:mb-0 flex-shrink-0"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-xl md:text-3xl font-light text-center mb-3 md:mb-6 text-white tracking-wider">
          Logga in
        </h1>

        <label className="text-gray-300 text-sm md:text-base">Username</label>
        <MyTextInput
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage("");
          }}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Username...."
        />

        <label className="text-gray-300 text-sm md:text-base">Lösenord</label>
        <MyTextInput
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage("");
          }}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Lösenord.."
        />

        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-2 md:p-3">
            <p className="text-red-200 text-xs md:text-sm text-center">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-700 bg-opacity-20 hover:bg-gray-600 hover:bg-opacity-30 active:bg-gray-500 active:bg-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-3 rounded-full shadow-lg transition-all duration-300 mb-2 md:mb-4 border border-gray-500 hover:border-white text-sm md:text-base touch-manipulation min-h-[44px]"
          onClick={login}
        >
          {isLoading ? "Loggar in..." : "LOGGA IN"}
        </button>

        <button
          type="button"
          className="w-full border border-gray-500 text-gray-300 hover:bg-gray-700 hover:bg-opacity-30 active:bg-gray-600 active:bg-opacity-40 hover:text-white font-semibold py-3 md:py-3 rounded-full transition-all duration-300 text-sm md:text-base touch-manipulation min-h-[44px]"
          onClick={() => navigate("/signup")}
        >
          SKAPA KONTO
        </button>
      </form>

      {/* Gubbar */}
      <div className="hidden md:flex items-center ml-4 flex-shrink-0">
        <img src={gubbeImage} alt="Gubbe" className="w-90 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-90 h-auto -ml-30" />
      </div>
    </div>
  );
}

export default LoginPage;
