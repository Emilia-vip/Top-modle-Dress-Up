import React, { createContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

// Vi skapar kontexten så att andra komponenter kan använda den
export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Här hämtar vi allt från Auth0 SDK
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <AuthContext.Provider value={{ 
      // Vi mappar Auth0:s värden till de namn du använde tidigare
      user: isAuthenticated ? user : null, 
      loading: isLoading,
      login: () => loginWithRedirect(),
      logout: () => logout({ logoutParams: { returnTo: window.location.origin } })
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;