import React, { createContext, useState, useEffect } from "react";
import { logoutApi } from "../services/authService";
import { setGlobalLogout } from "../services/apiConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ onLogout, children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const saveTokens = (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await logoutApi();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
        if (onLogout) onLogout();
    };

    const getAccessToken = () => localStorage.getItem("accessToken");
    const getRefreshToken = () => localStorage.getItem("refreshToken");

    useEffect(() => {
        setGlobalLogout(logout);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                saveTokens,
                logout,
                getAccessToken,
                getRefreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
