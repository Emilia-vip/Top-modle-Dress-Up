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

function LoginPage() {
  const { saveLogin } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post<AuthResponse>(`${BASE_URL}/login`, {
        username,
        password,
      });

      saveLogin(response.data);
    } catch (error) {
      alert("Login failed. Check your credentials.");
      console.error(error);
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
      {/* Login-box */}
      <div
        className="rounded-2xl shadow-2xl shadow-black p-10 w-full max-w-sm flex flex-col gap-4"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-3xl font-light text-center mb-6 text-white tracking-wider">
          Logga in
        </h1>

        <label className="text-gray-300">Username</label>
        <MyTextInput
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Username...."
        />

        <label className="text-gray-300">Lösenord</label>
        <MyTextInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Lösenord.."
        />

        <button
          className="w-full bg-gray-700 bg-opacity-20 hover:bg-gray-600 hover:bg-opacity-30 text-white font-semibold py-3 rounded-full shadow-lg transition-all duration-300 mb-4 border border-gray-500 hover:border-white"
          onClick={login}
        >
          LOGGA IN
        </button>

        <button
          className="w-full border border-gray-500 text-gray-300 hover:bg-gray-700 hover:bg-opacity-30 hover:text-white font-semibold py-3 rounded-full transition-all duration-300"
          onClick={() => navigate("/signup")}
        >
          SKAPA KONTO
        </button>
      </div>

      {/* Gubbar */}
      <div className="flex items-center ml-4">
        <img src={gubbeImage} alt="Gubbe" className="w-90 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-90 h-auto -ml-30" />
      </div>
    </div>
  );
}

export default LoginPage;
