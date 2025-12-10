import { useContext, useState } from "react";
import MyTextInput from "../components/MyTextInput";
import apiClient from "../api/client";
import { type AuthResponse } from "../type";
import { AuthContext } from "../contexts/AuthContext";
import validateEmail from "../utils/validateEmail";
import { useNavigate } from "react-router";
import gubbeImage from "../assets/gröngala.png";
import gubbeImage1 from "../assets/darksin-galablue.png";

type SignupData = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

function SignupPage() {
  const { saveLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (key: keyof SignupData, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const submitRegister = async () => {
    setErrorMessage("");
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage("Vänligen fyll i alla fält!");
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrorMessage("Ange en giltig e-postadress!");
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
        setErrorMessage("Registrering misslyckades. Försök igen senare.");
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
      {/* Signup-box */}
      <div
        className="rounded-2xl shadow-2xl shadow-black p-10 w-full max-w-sm flex flex-col gap-4"
        style={{
          backgroundColor: "rgba(31, 41, 55, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-3xl font-light text-center mb-6 text-white tracking-wider">
          Skapa konto
        </h1>

        <label className="text-gray-300">Namn</label>
        <MyTextInput
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Ditt namn"
        />

        <label className="text-gray-300">Telefon</label>
        <MyTextInput
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Telefonnummer"
        />

        <label className="text-gray-300">E-post</label>
        <MyTextInput
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="E-post...."
        />

        <label className="text-gray-300">Lösenord</label>
        <MyTextInput
          type="password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-5 py-3 focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
          placeholder="Lösenord...."
        />

        {errorMessage && (
          <p className="text-red-600 text-center">{errorMessage}</p>
        )}

        <button
          onClick={submitRegister}
          className="w-full bg-gray-700 bg-opacity-20 hover:bg-gray-600 hover:bg-opacity-30 text-white font-semibold py-3 rounded-full shadow-lg transition-all duration-300 mt-2 border border-gray-500 hover:border-white"
        >
          Skapa konto
        </button>
      </div>

      {/* Gubbar */}
      <div className="flex items-center ml-4">
        <img src={gubbeImage} alt="Gubbe" className="w-80 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-80 h-auto -ml-30" />
      </div>
    </div>
  );
}

export default SignupPage;
