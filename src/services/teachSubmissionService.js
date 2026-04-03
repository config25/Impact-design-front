import { API_BASE, apiCall } from "./apiConfig";

const BASE_URL = `${API_BASE}/teach`;

export const getSubmissionList = (gameId) =>
    apiCall(`${BASE_URL}/submission/list?gameId=${encodeURIComponent(gameId)}`, {}, "제출 현황을 불러오는데 실패했습니다.");

export const getImpactCheckByTeam = (teamId) =>
    apiCall(`${BASE_URL}/submission/impact-check?teamId=${encodeURIComponent(teamId)}`, {}, "성과관리 현황진단 데이터를 불러오는데 실패했습니다.");

export const getIdentityCanvasByTeam = (teamId) =>
    apiCall(`${BASE_URL}/submission/identity-canvas?teamId=${encodeURIComponent(teamId)}`, {}, "정체성 설계 데이터를 불러오는데 실패했습니다.");

export const getFlowCanvasByTeam = (teamId) =>
    apiCall(`${BASE_URL}/submission/flow-canvas?teamId=${encodeURIComponent(teamId)}`, {}, "성과경로 설계 데이터를 불러오는데 실패했습니다.");

export const getQuickWinByTeam = (teamId) =>
    apiCall(`${BASE_URL}/submission/quick-win?teamId=${encodeURIComponent(teamId)}`, {}, "전술적 실행과제 데이터를 불러오는데 실패했습니다.");

export const getBuildWinByTeam = (teamId) =>
    apiCall(`${BASE_URL}/submission/build-win?teamId=${encodeURIComponent(teamId)}`, {}, "전략적 실행과제 데이터를 불러오는데 실패했습니다.");

export const getFundingByTeam = (canvasType, teamId) =>
    apiCall(`${BASE_URL}/submission/funding/${encodeURIComponent(canvasType)}?teamId=${encodeURIComponent(teamId)}`, {}, "실행과제 검증 데이터를 불러오는데 실패했습니다.");

export const getFundingResultByTeam = (teamId) =>
    apiCall(`${BASE_URL}/submission/funding/result?teamId=${encodeURIComponent(teamId)}`, {}, "최종 결과 데이터를 불러오는데 실패했습니다.");
