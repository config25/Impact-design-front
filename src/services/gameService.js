import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/game`;

export const getUserStep = async () => {
    const response = await authFetch(`${BASE_URL}/step`);
    if (!response.ok) return "";
    const result = await response.json();
    return result.data?.step || "";
};

export const getDashboard = async () => {
    const response = await authFetch(`${BASE_URL}/dashboard`);
    if (!response.ok) throw new Error("dashboard fetch failed");
    const result = await response.json();
    return result.data;
};
