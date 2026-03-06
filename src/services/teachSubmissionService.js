import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/teach`;

export const getSubmissionList = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/submission/list?gameId=${encodeURIComponent(gameId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "제출 현황을 불러오는데 실패했습니다." };
};

export const getImpactCheckByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/impact-check?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "성과관리 현황진단 데이터를 불러오는데 실패했습니다." };
};

export const getIdentityCanvasByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/identity-canvas?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "정체성 설계 데이터를 불러오는데 실패했습니다." };
};

export const getFlowCanvasByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/flow-canvas?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "성과경로 설계 데이터를 불러오는데 실패했습니다." };
};

export const getQuickWinByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/quick-win?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "전술적 실행과제 데이터를 불러오는데 실패했습니다." };
};

export const getBuildWinByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/build-win?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "전략적 실행과제 데이터를 불러오는데 실패했습니다." };
};

/**
 * 실행과제 검증 열람 (F-1: quick, F-2: build)
 */
export const getFundingByTeam = async (canvasType, teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/funding/${encodeURIComponent(canvasType)}?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "실행과제 검증 데이터를 불러오는데 실패했습니다." };
};

/**
 * 팀별 최종 결과 열람 (F-3: Quick Win + Build Win)
 */
export const getFundingResultByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/funding/result?teamId=${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "최종 결과 데이터를 불러오는데 실패했습니다." };
};
