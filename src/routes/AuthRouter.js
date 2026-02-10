import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router";
import LoginPage from "../page/LoginPage";
import SignupPage from "../page/SignupPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(LoginPage, {}),
    },
    {
        path: "/signup",
        element: _jsx(SignupPage, {}),
    },
    {
        path: "/forgot-password",
        element: _jsx("div", { children: "Gl\u00F6mt l\u00F6senord" }),
    },
]);
export default router;
