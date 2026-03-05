import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "../page/LoginPage";
//import SignupPage from "../page/SignupPage";

const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    path: "*",
    element: <Navigate to="/" replace/>
  },
  /*{
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <div>Glömt lösenord</div>,
  },*/
]);

export default authRouter;
