import { RouterProvider } from "react-router";
import authRouter from "./routes/AuthRouter";
import appRouter from "./routes/AppRouter";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";


function App() {
  
  const { user, loading } = useContext(AuthContext);
  return (

    <div className="w-full h-screen flex items-start justify-center">
      {!loading && <RouterProvider router={user ? appRouter : authRouter} />}
    </div>
  );
};

export default App;