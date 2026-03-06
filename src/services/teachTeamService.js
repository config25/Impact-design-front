import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/teach`;

export const saveStep = async (gameId, step) => {
    const response = await authFetch(`${BASE_URL}/step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, step }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "단계 저장에 실패했습니다." };
};

export const addTeam = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/team?gameId=${encodeURIComponent(gameId)}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "팀 추가에 실패했습니다." };
};

export const addEvaluationTeam = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/evaluation-team?gameId=${encodeURIComponent(gameId)}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "평가팀 추가에 실패했습니다." };
};

export const deleteTeam = async (teamId, gameId) => {
    const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}?gameId=${encodeURIComponent(gameId)}`, {
        method: "DELETE",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀 삭제에 실패했습니다." };
};

export const getDeletedTeams = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/deleted-teams?gameId=${encodeURIComponent(gameId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "삭제된 팀 목록을 불러오는데 실패했습니다." };
};

export const restoreTeam = async (teamId, gameId) => {
    const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}/restore?gameId=${encodeURIComponent(gameId)}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀 복원에 실패했습니다." };
};

export const getTeamInfo = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "팀 정보를 불러오는데 실패했습니다." };
};

export const updateTeamInfo = async (teamId, data) => {
    const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀 정보 수정에 실패했습니다." };
};

export const addTeamMember = async (teamId, gameId) => {
    const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}/members?gameId=${encodeURIComponent(gameId)}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, loginId: result.data };
    }

    return { success: false, message: result.data?.message || "팀원 추가에 실패했습니다." };
};

export const setTeamWriter = async (teamId, userId) => {
    const response = await authFetch(`${BASE_URL}/team/${encodeURIComponent(teamId)}/writer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "대표 작성자 지정에 실패했습니다." };
};

export const deleteTeamMembers = async (userIds) => {
    const response = await authFetch(`${BASE_URL}/team-members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀원 삭제에 실패했습니다." };
};

export const updateTeamMember = async (userId, teamId) => {
    const response = await authFetch(`${BASE_URL}/team-member`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, teamId }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀 이동에 실패했습니다." };
};
