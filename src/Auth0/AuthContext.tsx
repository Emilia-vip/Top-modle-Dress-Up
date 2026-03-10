import React, { createContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BASE_URL } from '../constants';

const AUTH0_ACCESS_TOKEN_KEY = 'auth0_access_token';

// Vi skapar kontexten så att andra komponenter kan använda den
export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Här hämtar vi allt från Auth0 SDK
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();
  const [dbUser, setDbUser] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const syncAuth0Token = async () => {
      if (!isAuthenticated) {
        sessionStorage.removeItem(AUTH0_ACCESS_TOKEN_KEY);
        return;
      }

      try {
        const token = await getAccessTokenSilently();

        // Some Auth0 setups return opaque access tokens without audience.
        // Backend JWT verification needs a JWT, so fallback to id_token when needed.
        const isJwt = token.split('.').length === 3;

        if (isJwt) {
          sessionStorage.setItem(AUTH0_ACCESS_TOKEN_KEY, token);
          return;
        }

        const claims = await getIdTokenClaims();
        const idToken = claims?.__raw;

        if (idToken) {
          sessionStorage.setItem(AUTH0_ACCESS_TOKEN_KEY, idToken);
          return;
        }

        sessionStorage.removeItem(AUTH0_ACCESS_TOKEN_KEY);
      } catch {
        try {
          const claims = await getIdTokenClaims();
          const idToken = claims?.__raw;

          if (idToken) {
            sessionStorage.setItem(AUTH0_ACCESS_TOKEN_KEY, idToken);
            return;
          }
        } catch {
          // Ignore and clear token below.
        }

        sessionStorage.removeItem(AUTH0_ACCESS_TOKEN_KEY);
      }
    };

    void syncAuth0Token();
  }, [getAccessTokenSilently, getIdTokenClaims, isAuthenticated]);

  // när Auth0-användaren ändras, slå upp motsvarande dokument i vår databas
  useEffect(() => {
    if (isAuthenticated && auth0User?.sub) {
      const id = encodeURIComponent(auth0User.sub as string);
      fetch(`${BASE_URL}/users/auth0/${id}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
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

  const updateDbUser = (patch: Record<string, unknown>) => {
    setDbUser((prev: Record<string, unknown> | null) =>
      prev ? { ...prev, ...patch } : patch
    );
  };

  return (
    <AuthContext.Provider value={{
      user: mergedUser,
      loading: isLoading,
      login: () => loginWithRedirect(),
      signup: () =>
        loginWithRedirect({
          authorizationParams: { screen_hint: 'signup' },
        }),
      logout: () => {
        sessionStorage.removeItem(AUTH0_ACCESS_TOKEN_KEY);
        logout({ logoutParams: { returnTo: window.location.origin } });
      },
      updateDbUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
