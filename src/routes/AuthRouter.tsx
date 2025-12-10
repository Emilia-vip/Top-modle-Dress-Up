import { createBrowserRouter } from "react-router";
import LoginPage from "../page/LoginPage";
import SignupPage from "../page/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <div>Glömt lösenord</div>,
  },
]);

export default router;
