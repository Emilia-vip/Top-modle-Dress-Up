import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
const rootDiv = document.getElementById("root");
const root = createRoot(rootDiv!);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);