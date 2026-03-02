import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./Auth0/AuthContext.tsx";
import { Auth0Provider } from '@auth0/auth0-react';

const rootDiv = document.getElementById("root");
const root = createRoot(rootDiv!);

root.render(
 
  <Auth0Provider
    domain="dev-lvoqsmt6onaj5n1w.us.auth0.com" 
    clientId="CP9CP9RFcy4X5uPKNdFQvgC2gzTpTTLc"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </Auth0Provider>
);