import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
export default function AppLayout() {
    return (_jsxs("div", { className: "w-full h-screen flex flex-col", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-1", children: _jsx(Outlet, {}) })] }));
}
