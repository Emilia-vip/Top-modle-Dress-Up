// routes/AuthRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Auth0/AuthContext";

// En enkel landningssida för utloggade användare
const LoginPage = () => {
  const { login } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">Top Model Dress Up</h1>
        <p className="mb-6 text-gray-600">Logga in för att skapa och spara dina stilar!</p>
        
        <button
          onClick={() => login()}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105"
        >
          Logga in / Skapa konto
        </button>
      </div>
    </div>
  );
};

// Här skapar vi själva routern
const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    // Om användaren försöker gå till en annan sida när de är utloggade, 
    // skicka dem tillbaka till startsidan/login
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);

export default authRouter;