import { API_BASE, authFetch, safeParse, apiCall } from "./apiConfig";

const BASE_URL = `${API_BASE}/game`;

export const getUserStep = async () => {
    try {
        const response = await authFetch(`${BASE_URL}/step`);
        if (!response.ok) return "";
        const result = await safeParse(response);
        return result.data?.step || "";
    } catch {
        return "";
    }
};

export const getDashboard = () =>
    apiCall(`${BASE_URL}/dashboard`, {}, "대시보드 조회에 실패했습니다.");
