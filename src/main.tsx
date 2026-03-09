import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Auth0AppProvider from "./Auth0/AuthContext.tsx";
import LegacyAuthProvider from "./contexts/AuthContext.tsx";
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
    <LegacyAuthProvider>
      <Auth0AppProvider>
        <App />
      </Auth0AppProvider>
    </LegacyAuthProvider>
  </Auth0Provider>
);