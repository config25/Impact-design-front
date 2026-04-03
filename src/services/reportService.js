import { API_BASE, apiCall } from "./apiConfig";

const BASE_URL = `${API_BASE}/report`;

export const getReport = () =>
    apiCall(BASE_URL, {}, "리포트 조회에 실패했습니다.");

export const getReportByTeam = (teamId) =>
    apiCall(`${API_BASE}/teach/report/${encodeURIComponent(teamId)}`, {}, "리포트 조회에 실패했습니다.");

export const getTeamCanvases = (gameId) =>
    apiCall(`${API_BASE}/teach/report/canvas/${encodeURIComponent(gameId)}`, {}, "캔버스 데이터 조회에 실패했습니다.");
