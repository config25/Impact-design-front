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
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "대시보드 조회에 실패했습니다." };
};
