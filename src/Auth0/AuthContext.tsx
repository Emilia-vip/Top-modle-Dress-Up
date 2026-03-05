import React, { createContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BASE_URL } from '../constants';

// Vi skapar kontexten så att andra komponenter kan använda den
export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Här hämtar vi allt från Auth0 SDK
  const { user: auth0User, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const [dbUser, setDbUser] = useState<any>(null);

  // när Auth0-användaren ändras, slå upp motsvarande dokument i vår databas
  useEffect(() => {
    if (isAuthenticated && auth0User?.sub) {
      const id = encodeURIComponent(auth0User.sub as string);
      fetch(`${BASE_URL}/users/${id}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          // 404 = användaren finns inte ännu; vi återställer dbUser
          if (res.status === 404) return null;
          throw new Error(`HTTP ${res.status}`);
        })
        .then(data => setDbUser(data))
        .catch(err => {
          console.warn('Failed to fetch DB user', err);
          setDbUser(null);
        });
    } else {
      setDbUser(null);
    }
  }, [isAuthenticated, auth0User]);

  // merge Auth0- och DB-data, DB-fields override
  const mergedUser = isAuthenticated
    ? { ...auth0User, ...(dbUser || {}) }
    : null;

  const updateDbUser = (patch: any) => {
    setDbUser(prev => (prev ? { ...prev, ...patch } : patch));
  };

  return (
    <AuthContext.Provider value={{
      user: mergedUser,
      loading: isLoading,
      login: () => loginWithRedirect(),
      logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
      updateDbUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
