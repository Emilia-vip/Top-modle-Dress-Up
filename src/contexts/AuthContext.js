import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import apiClient from "../api/client";
export const AuthContext = createContext({
    user: null,
    loading: false,
    saveLogin: () => {
        console.log("This is a fallback method, you must be a child to AuthProvider to access the real values.");
    },
    logout: () => { },
});
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const saveLogin = (authData) => {
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
            const response = await apiClient.post(`/refresh_token`, {
                refresh_token: storedRefreshToken,
            });
            saveLogin(response.data);
            setLoading(false);
        };
        if (storedRefreshToken) {
            retrieveToken();
        }
        else {
            setLoading(false);
        }
    }, []);
    return (_jsx(AuthContext.Provider, { value: { user, loading, saveLogin, logout }, children: children }));
}
export default AuthProvider;
