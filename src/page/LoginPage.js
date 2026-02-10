import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/page/LoginPage.tsx
import { useNavigate } from "react-router";
import MyTextInput from "../components/MyTextInput";
import runway from "../assets/runway,new.png";
import gubbeImage from "../assets/gröngala.png";
import gubbeImage1 from "../assets/Bluedress.png";
import { useLogin } from "../hooks/useLogin";
function LoginPage() {
    const navigate = useNavigate();
    const { username, setUsername, password, setPassword, errorMessage, setErrorMessage, isLoading, login } = useLogin();
    const handleSubmit = (e) => {
        e.preventDefault();
        login();
    };
    return (_jsxs("div", { className: "min-h-screen w-full flex items-center justify-center bg-cover bg-center px-2 py-4", style: { backgroundImage: `url(${runway})` }, children: [_jsxs("form", { onSubmit: handleSubmit, className: "rounded-xl md:rounded-2xl shadow-2xl p-5 md:p-10 w-full max-w-xs md:max-w-sm flex flex-col gap-3 shadow-black", style: { backgroundColor: "rgba(31, 41, 55, 0.4)", backdropFilter: "blur(10px)" }, children: [_jsx("h1", { className: "text-xl md:text-3xl font-light text-center mb-4 text-white tracking-wider", children: "SIGN IN" }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-gray-300 text-sm md:text-base", children: "Username" }), _jsx(MyTextInput, { value: username, onChange: (e) => { setUsername(e.target.value); setErrorMessage(""); }, className: "border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400", placeholder: "Username...." })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-gray-300 text-sm", children: "Password" }), _jsx(MyTextInput, { type: "password", value: password, onChange: (e) => { setPassword(e.target.value); setErrorMessage(""); }, className: "border-b border-gray-500 bg-gray-700 bg-opacity-20 text-white rounded-full px-3 py-2 md:px-5 md:py-3 text-sm md:text-base focus:outline-none focus:border-white transition-all duration-300 placeholder-gray-400", placeholder: "Password.." })] }), errorMessage && (_jsx("div", { className: "bg-red-500/20 border border-red-500 rounded-lg p-2", children: _jsx("p", { className: "text-red-200 text-xs text-center", children: errorMessage }) })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-full border border-gray-500 transition-all mt-2", children: isLoading ? "Logging in..." : "LOGIN" }), _jsx("button", { type: "button", className: "w-full border border-gray-500 text-gray-300 hover:text-white py-3 rounded-full transition-all text-sm", onClick: () => navigate("/signup"), children: "CREATE ACCOUNT" })] }), _jsxs("div", { className: "hidden md:flex items-center ml-4", children: [_jsx("img", { src: gubbeImage, alt: "Gubbe", className: "w-80 h-auto" }), _jsx("img", { src: gubbeImage1, alt: "Gubbe", className: "w-80 h-auto -ml-30" })] })] }));
}
export default LoginPage;
