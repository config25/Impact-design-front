import { API_BASE, apiCall, authFetch, safeParse } from "./apiConfig";

export const getFundingTeams = (canvasType) =>
    apiCall(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/teams`, {}, "팀 목록 조회에 실패했습니다.");

export const getFundingInvestment = (canvasType, teamId) =>
    apiCall(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/investment?teamId=${encodeURIComponent(teamId)}`, {}, "투자 정보 조회에 실패했습니다.");

export const getFundingStatus = (canvasType) =>
    apiCall(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/status`, {}, "상태 조회에 실패했습니다.");

export const saveFundingInvestment = (canvasType, data) =>
    apiCall(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/investment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }, "저장에 실패했습니다.");

export const submitFundingInvestment = async (canvasType, data) => {
    try {
        const response = await authFetch(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/submit`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const result = await safeParse(response);

        if (response.ok) return { success: true, data: result.data };
        if (response.status === 409) return { success: false, message: "이미 제출되었습니다." };
        return { success: false, message: result.data?.message || "제출에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const getFundingPortfolio = (canvasType) =>
    apiCall(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/portfolio`, {}, "포트폴리오 조회에 실패했습니다.");

export const getFundingScores = (canvasType) =>
    apiCall(`${API_BASE}/funding/${encodeURIComponent(canvasType)}/scores`, {}, "점수 조회에 실패했습니다.");

export const getMyResult = () =>
    apiCall(`${API_BASE}/funding/my-result`, {}, "최종 결과 조회에 실패했습니다.");
