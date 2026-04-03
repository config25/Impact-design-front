import { API_BASE, apiCall, authFetch, safeParse } from "./apiConfig";

const BASE_URL = `${API_BASE}/teach`;

const jsonOpts = (method, body) => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
});

export const saveStep = async (gameId, step) => {
    try {
        const response = await authFetch(`${BASE_URL}/step`, jsonOpts("POST", { gameId, step }));
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "단계 저장에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const addTeam = (gameId) =>
    apiCall(`${BASE_URL}/team?gameId=${encodeURIComponent(gameId)}`, { method: "POST" }, "팀 추가에 실패했습니다.");

export const addEvaluationTeam = (gameId) =>
    apiCall(`${BASE_URL}/evaluation-team?gameId=${encodeURIComponent(gameId)}`, { method: "POST" }, "평가팀 추가에 실패했습니다.");

export const deleteTeam = async (teamId, gameId) => {
    try {
        const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}?gameId=${encodeURIComponent(gameId)}`, { method: "DELETE" });
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "팀 삭제에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const getDeletedTeams = (gameId) =>
    apiCall(`${BASE_URL}/deleted-teams?gameId=${encodeURIComponent(gameId)}`, {}, "삭제된 팀 목록을 불러오는데 실패했습니다.");

export const restoreTeam = async (teamId, gameId) => {
    try {
        const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}/restore?gameId=${encodeURIComponent(gameId)}`, { method: "POST" });
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "팀 복원에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const getTeamInfo = (teamId) =>
    apiCall(`${BASE_URL}/team/${encodeURIComponent(teamId)}`, {}, "팀 정보를 불러오는데 실패했습니다.");

export const updateTeamInfo = async (teamId, data) => {
    try {
        const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}`, jsonOpts("PUT", data));
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "팀 정보 수정에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const addTeamMember = async (teamId, gameId) => {
    try {
        const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}/members?gameId=${encodeURIComponent(gameId)}`, { method: "POST" });
        const result = await safeParse(response);
        if (response.ok) return { success: true, loginId: result.data };
        return { success: false, message: result.data?.message || "팀원 추가에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const setTeamWriter = async (teamId, userId) => {
    try {
        const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}/writer`, jsonOpts("POST", { userId }));
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "대표 작성자 지정에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const deleteTeamMembers = async (userIds) => {
    try {
        const response = await authFetch(`${BASE_URL}/team-members`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds }),
        });
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "팀원 삭제에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const updateTeamMember = async (userId, teamId) => {
    try {
        const response = await authFetch(`${BASE_URL}/team-member`, jsonOpts("PUT", { userId, teamId }));
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "팀 이동에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};
