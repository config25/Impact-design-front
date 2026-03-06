import React, { createContext, useState, useCallback } from "react";
import { getDashboard } from "../services/gameService";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [dashboard, setDashboard] = useState(null);

    const fetchDashboard = useCallback(async () => {
        const result = await getDashboard();
        if (result.success) {
            setDashboard(result.data);
        } else {
            setDashboard(null);
        }
    }, []);

    const clearDashboard = useCallback(() => {
        setDashboard(null);
    }, []);

    return (
        <DashboardContext.Provider value={{ dashboard, fetchDashboard, clearDashboard }}>
            {children}
        </DashboardContext.Provider>
    );
};
