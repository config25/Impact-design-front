import React, { createContext, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "../services/authService";
import { setGlobalLogout, setLoggingOut } from "../services/apiConfig";

const getTokenExp = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;
    const tokenTimerRef = useRef(null);

    const logout = useCallback(() => {
        setLoggingOut();
        if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current);
        const wasTeacher = !!sessionStorage.getItem("userRole");
        logoutApi().catch(() => {});
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userRole");
        setIsLoggedIn(false);
        navigateRef.current(wasTeacher ? "/teacher_login" : "/");
    }, []);

    const startTokenTimer = useCallback((accessToken) => {
        if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current);
        const exp = getTokenExp(accessToken);
        if (!exp) return;
        const msLeft = exp - Date.now();
        if (msLeft <= 0) {
            logout();
            return;
        }
        tokenTimerRef.current = setTimeout(() => {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            logout();
        }, msLeft);
    }, [logout]);

    const saveTokens = useCallback((accessToken, refreshToken, userRole) => {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
        if (userRole) sessionStorage.setItem("userRole", userRole);
        setIsLoggedIn(true);
        startTokenTimer(accessToken);
    }, [startTokenTimer]);

    useEffect(() => {
        setGlobalLogout(logout);
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            setIsLoggedIn(true);
            startTokenTimer(token);
        }
        return () => { if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current); };
    }, [logout, startTokenTimer]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                saveTokens,
                logout,
                getAccessToken: () => sessionStorage.getItem("accessToken"),
                getRefreshToken: () => sessionStorage.getItem("refreshToken"),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
