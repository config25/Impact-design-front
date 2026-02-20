import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/teach`;
const ADMIN_BASE_URL = `${API_BASE}/admin/teach`;

const isAdmin = () => sessionStorage.getItem("userRole") === "ADMIN";

export const getTeachIndex = async () => {
    const url = isAdmin() ? ADMIN_BASE_URL : BASE_URL;
    const response = await authFetch(url);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "강의실 목록을 불러오는데 실패했습니다." };
};

export const getTeachDetail = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/detail?gameId=${gameId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "강의실 상세 정보를 불러오는데 실패했습니다." };
};

export const getTeachDetail2 = async (gameId) => {
    const url = gameId ? `${BASE_URL}/detail2?gameId=${gameId}` : `${BASE_URL}/detail2`;
    const response = await authFetch(url);
    const text = await response.text();
    const result = text ? JSON.parse(text) : null;

    if (response.ok && result) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result?.data?.message || "강의실 상세 정보를 불러오는데 실패했습니다." };
};

export const getStudentList = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/student-list?gameId=${gameId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "교육생 목록을 불러오는데 실패했습니다." };
};

export const getTeachList = async () => {
    const url = isAdmin() ? `${ADMIN_BASE_URL}/list` : `${BASE_URL}/list`;
    const response = await authFetch(url);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "강의실 현황을 불러오는데 실패했습니다." };
};

export const createClass = async (data, imageFile) => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imageFile) {
        formData.append("image", imageFile);
    }
    const response = await authFetch(`${BASE_URL}/class`, {
        method: "POST",
        body: formData,
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "강의실 생성에 실패했습니다." };
};

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
    const response = await authFetch(`${BASE_URL}/team?gameId=${gameId}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "팀 추가에 실패했습니다." };
};

export const addEvaluationTeam = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/evaluation-team?gameId=${gameId}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "평가팀 추가에 실패했습니다." };
};

export const deleteTeam = async (teamId, gameId) => {
    const response = await authFetch(`${BASE_URL}/team/${teamId}?gameId=${gameId}`, {
        method: "DELETE",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀 삭제에 실패했습니다." };
};

export const getDeletedTeams = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/deleted-teams?gameId=${gameId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "삭제된 팀 목록을 불러오는데 실패했습니다." };
};

export const restoreTeam = async (teamId, gameId) => {
    const response = await authFetch(`${BASE_URL}/team/${teamId}/restore?gameId=${gameId}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "팀 복원에 실패했습니다." };
};

export const getSubmissionList = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/submission/list?gameId=${gameId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "제출 현황을 불러오는데 실패했습니다." };
};

export const getImpactCheckByTeam = async (teamId) => {
    const response = await authFetch(`${API_BASE}/teach/submission/impact-check?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "성과관리 현황진단 데이터를 불러오는데 실패했습니다." };
};

export const getIdentityCanvasByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/identity-canvas?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "정체성 설계 데이터를 불러오는데 실패했습니다." };
};

export const getFlowCanvasByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/flow-canvas?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "성과경로 설계 데이터를 불러오는데 실패했습니다." };
};

export const getQuickWinByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/quick-win?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "전술적 실행과제 데이터를 불러오는데 실패했습니다." };
};

export const getBuildWinByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/build-win?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "전략적 실행과제 데이터를 불러오는데 실패했습니다." };
};

/**
 * 실행과제 검증 열람 (F-1: quick, F-2: build)
 * @param {string} canvasType - "quick" 또는 "build"
 * @param {number} teamId - 팀 ID
 */
export const getFundingByTeam = async (canvasType, teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/funding/${canvasType}?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "실행과제 검증 데이터를 불러오는데 실패했습니다." };
};

/**
 * 팀별 최종 결과 열람 (F-3: Quick Win + Build Win)
 * @param {number} teamId - 팀 ID
 */
export const getFundingResultByTeam = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/submission/funding/result?teamId=${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "최종 결과 데이터를 불러오는데 실패했습니다." };
};

export const getTeamInfo = async (teamId) => {
    const response = await authFetch(`${BASE_URL}/team/${teamId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "팀 정보를 불러오는데 실패했습니다." };
};

export const updateTeamInfo = async (teamId, data) => {
    const response = await authFetch(`${BASE_URL}/team/${teamId}`, {
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
    const response = await authFetch(`${BASE_URL}/team/${teamId}/members?gameId=${gameId}`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, loginId: result.data };
    }

    return { success: false, message: result.data?.message || "팀원 추가에 실패했습니다." };
};

export const setTeamWriter = async (teamId, userId) => {
    const response = await authFetch(`${BASE_URL}/team/${teamId}/writer`, {
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

export const restoreClass = async (gameId, enddate) => {
    const response = await authFetch(`${BASE_URL}/class/${gameId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enddate }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "강의실 복원에 실패했습니다." };
};

export const endClass = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/class/${gameId}/end`, {
        method: "POST",
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "강의실 종료에 실패했습니다." };
};

export const startClass = async (gameId, enddate) => {
    const response = await authFetch(`${BASE_URL}/class/${gameId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enddate }),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true };
    }

    return { success: false, message: result.data?.message || "교육 시작에 실패했습니다." };
};

export const updateClass = async (gameId, data) => {
    const response = await authFetch(`${BASE_URL}/class/${gameId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "강의실 수정에 실패했습니다." };
};
