import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import { logoutApi } from "../services/authService";
import { setGlobalLogout } from "../services/apiConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ onLogout, children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const onLogoutRef = useRef(onLogout);
    onLogoutRef.current = onLogout;

    const saveTokens = (accessToken, refreshToken, userRole) => {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        if (userRole) sessionStorage.setItem("userRole", userRole);
        setIsLoggedIn(true);
    };

    const logout = useCallback(() => {
        const wasTeacher = !!sessionStorage.getItem("userRole");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userRole");
        setIsLoggedIn(false);
        if (onLogoutRef.current) onLogoutRef.current(wasTeacher);
        logoutApi().catch(() => {});
    }, []);

    const getAccessToken = () => sessionStorage.getItem("accessToken");
    const getRefreshToken = () => sessionStorage.getItem("refreshToken");

    useEffect(() => {
        setGlobalLogout(logout);
    }, [logout]);

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
