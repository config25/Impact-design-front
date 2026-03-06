import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/report`;

export const getReport = async () => {
    const response = await authFetch(BASE_URL);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "리포트 조회에 실패했습니다." };
};

export const getReportByTeam = async (teamId) => {
    const response = await authFetch(`${API_BASE}/teach/report/${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "리포트 조회에 실패했습니다." };
};

export const getBulkReport = async (gameId) => {
    const response = await authFetch(`${API_BASE}/teach/report/bulk/${encodeURIComponent(gameId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "전체 리포트 조회에 실패했습니다." };
};
