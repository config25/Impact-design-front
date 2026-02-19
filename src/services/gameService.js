import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/game`;

export const getUserStep = async () => {
    const response = await authFetch(`${BASE_URL}/step`);
    if (!response.ok) return "";
    const result = await response.json();
    return result.data?.step || "";
};
