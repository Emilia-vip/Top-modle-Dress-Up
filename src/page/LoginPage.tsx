// src/page/LoginPage.tsx
import { useNavigate } from "react-router";
import MyTextInput from "../components/MyTextInput";
import runway from "../assets/runway,new.png";
import gubbeImage from "../assets/gröngala.png";
import gubbeImage1 from "../assets/Bluedress.png";
import { useLogin } from "../hooks/useLogin";

function LoginPage() {
  const navigate = useNavigate();
  const {
    username, setUsername,
    password, setPassword,
    errorMessage, setErrorMessage,
    isLoading, login
  } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 py-4"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-xl md:rounded-2xl shadow-2xl p-5 md:p-10 w-full max-w-xs md:max-w-sm flex flex-col gap-3 shadow-black"
        style={{ backgroundColor: "rgba(31, 41, 55, 0.4)", backdropFilter: "blur(10px)" }}
      >
        <h1 className="text-xl md:text-3xl font-light text-center mb-4 text-white tracking-wider">
          SIGN IN
        </h1>

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm md:text-base">Username</label>
          <MyTextInput
            value={username}
            onChange={(e) => { setUsername(e.target.value); setErrorMessage(""); }}
            className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
            placeholder="Username...."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Password</label>
          <MyTextInput
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
            className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
            placeholder="Password.."
          />
        </div>

        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-2">
            <p className="text-red-200 text-xs text-center">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-full border border-gray-500 transition-all mt-2"
        >
          {isLoading ? "Logging in..." : "LOGIN"}
        </button>

        <button
          type="button"
          className="w-full border border-gray-500 text-gray-300 hover:text-white py-3 rounded-full transition-all text-sm"
          onClick={() => navigate("/signup")}
        >
          CREATE ACCOUNT
        </button>
      </form>

      <div className="hidden md:flex items-center ml-4">
        <img src={gubbeImage} alt="Gubbe" className="w-80 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-80 h-auto -ml-30" />
      </div>
    </div>
  );
}

export default LoginPage;