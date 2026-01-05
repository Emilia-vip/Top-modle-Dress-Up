import { createContext, useEffect, useState } from "react";
import type { AuthResponse, User } from "../type";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import apiClient from "../api/client";


type AuthContextType = {
  user: User | null;
  loading: boolean;
  saveLogin: (authData: AuthResponse) => void;
  logout: () => void;
};
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  saveLogin: () => {
    console.log(
      "This is a fallback method, you must be a child to AuthProvider to access the real values."
    );
  },
  logout: () => {},
});
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveLogin = (authData: AuthResponse) => {
    setUser(authData.user);
    localStorage.setItem(REFRESH_TOKEN, authData.refresh_token);
    localStorage.setItem(ACCESS_TOKEN, authData.access_token);
  };

  const logout = () => {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN);
    setUser(null);
  };

  useEffect(() => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
    const retrieveToken = async () => {
      const response = await apiClient.post<AuthResponse>(`/refresh_token`, {
        refresh_token: storedRefreshToken,
      });


      saveLogin(response.data);
      setLoading(false);
    };

    if (storedRefreshToken) {
      retrieveToken();
    } else {
      setLoading(false);
    }

  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, saveLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;