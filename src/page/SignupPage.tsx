import MyTextInput from "../components/MyTextInput";
import runway from "../assets/runway,new.png";
import gubbeImage from "../assets/gröngala.png";
import gubbeImage1 from "../assets/Bluedress.png";
import { useSignup } from "../hooks/useSignup";

function SignupPage() {
  const { 
    formData, errorMessage, isLoading, usernameStatus, 
    updateField, checkUsername, submitRegister 
  } = useSignup();

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 py-4"
      style={{ backgroundImage: `url(${runway})` }}
    >
      <div
        className="rounded-xl md:rounded-2xl shadow-2xl p-6 w-full max-w-xs md:max-w-sm flex flex-col gap-3"
        style={{ backgroundColor: "rgba(31, 41, 55, 0.4)", backdropFilter: "blur(10px)" }}
      >
        <h1 className="text-xl md:text-3xl font-light text-center mb-4 text-white tracking-wider">
          Create account
        </h1>

        {/* Username Fält */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Username</label>
          <MyTextInput
            value={formData.username}
            onChange={(e) => updateField("username", e.target.value)}
            onBlur={() => checkUsername(formData.username)}
            className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
            placeholder="Username"
          />
          {usernameStatus === "checking" && <p className="text-[10px] text-gray-300">Checking...</p>}
          {usernameStatus === "available" && <p className="text-[10px] text-green-500">Available!</p>}
          {usernameStatus === "taken" && <p className="text-[10px] text-red-500">Taken</p>}
        </div>

        {/* Email, Phone & Password (likadana fält) */}
        {["phone", "email", "password"].map((field) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-amber-50 text-sm capitalize">{field}</label>
            <MyTextInput
              type={field === "password" ? "password" : "text"}
              value={(formData as any)[field]}
              onChange={(e) => updateField(field, e.target.value)}
              className="border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          </div>
        ))}

        {errorMessage && (
          <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded">{errorMessage}</p>
        )}

        <button
          onClick={submitRegister}
          disabled={isLoading}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-full border border-gray-500 transition-all mt-4"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
      </div>

      {/* Bilder för desktop */}
      <div className="hidden md:flex items-center ml-4">
        <img src={gubbeImage} alt="Gubbe" className="w-80 h-auto" />
        <img src={gubbeImage1} alt="Gubbe" className="w-80 h-auto -ml-32" />
      </div>
    </div>
  );
}

export default SignupPage;