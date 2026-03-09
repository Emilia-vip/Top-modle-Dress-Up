import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../page/LoginPage";
import SignupPage from "../page/SignupPage";

const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default authRouter;
