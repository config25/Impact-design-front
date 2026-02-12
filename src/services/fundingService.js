import { API_BASE, authFetch } from "./apiConfig";

/**
 * 투자 대상 팀 목록 조회 (내 팀 제외)
 * @param {string} canvasType - "quick" 또는 "build"
 */
export const getFundingTeams = async (canvasType) => {
    const response = await authFetch(`${API_BASE}/funding/${canvasType}/teams`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "팀 목록 조회에 실패했습니다." };
};

/**
 * 특정 팀에 대한 투자 정보 조회
 * @param {string} canvasType - "quick" 또는 "build"
 * @param {number} teamId - 투자 대상 팀 ID
 */
export const getFundingInvestment = async (canvasType, teamId) => {
    const response = await authFetch(`${API_BASE}/funding/${canvasType}/investment?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "투자 정보 조회에 실패했습니다." };
};

/**
 * 제출 상태 확인
 * @param {string} canvasType - "quick" 또는 "build"
 */
export const getFundingStatus = async (canvasType) => {
    const response = await authFetch(`${API_BASE}/funding/${canvasType}/status`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "상태 조회에 실패했습니다." };
};

/**
 * 투자 의향서 저장/제출
 * @param {string} canvasType - "quick" 또는 "build"
 * @param {object} data - { investmentTarget, investmentPrice, score1~9, opinion, submit }
 */
export const saveFundingInvestment = async (canvasType, data) => {
    const response = await authFetch(`${API_BASE}/funding/${canvasType}/investment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "저장에 실패했습니다." };
};

/**
 * 내 투자 포트폴리오 조회
 * @param {string} canvasType - "quick" 또는 "build"
 */
export const getFundingPortfolio = async (canvasType) => {
    const response = await authFetch(`${API_BASE}/funding/${canvasType}/portfolio`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "포트폴리오 조회에 실패했습니다." };
};

/**
 * 전체 팀 평가 점수 조회 (차트용)
 * @param {string} canvasType - "quick" 또는 "build"
 */
export const getFundingScores = async (canvasType) => {
    const response = await authFetch(`${API_BASE}/funding/${canvasType}/scores`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "점수 조회에 실패했습니다." };
};

/**
 * 내 팀의 최종 결과 조회 (Quick Win + Build Win)
 */
export const getMyResult = async () => {
    const response = await authFetch(`${API_BASE}/funding/my-result`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "최종 결과 조회에 실패했습니다." };
};
