import { API_BASE, apiCall, authFetch, safeParse } from "./apiConfig";

const BASE_URL = `${API_BASE}/teach`;
const ADMIN_BASE_URL = `${API_BASE}/admin/teach`;

const isAdmin = () => sessionStorage.getItem("userRole") === "ADMIN";

export const getTeachIndex = () =>
    apiCall(isAdmin() ? ADMIN_BASE_URL : BASE_URL, {}, "강의실 목록을 불러오는데 실패했습니다.");

export const getTeachDetail = (gameId) =>
    apiCall(`${BASE_URL}/detail?gameId=${encodeURIComponent(gameId)}`, {}, "강의실 상세 정보를 불러오는데 실패했습니다.");

export const getTeachDetail2 = (gameId) => {
    const url = gameId ? `${BASE_URL}/detail2?gameId=${encodeURIComponent(gameId)}` : `${BASE_URL}/detail2`;
    return apiCall(url, {}, "강의실 상세 정보를 불러오는데 실패했습니다.");
};

export const getTeachList = () =>
    apiCall(isAdmin() ? `${ADMIN_BASE_URL}/list` : `${BASE_URL}/list`, {}, "강의실 현황을 불러오는데 실패했습니다.");

export const getStudentList = (gameId) =>
    apiCall(`${BASE_URL}/student-list?gameId=${encodeURIComponent(gameId)}`, {}, "교육생 목록을 불러오는데 실패했습니다.");

export const createClass = async (data, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("request", new Blob([JSON.stringify(data)], { type: "application/json" }));
        if (imageFile) {
            formData.append("image", imageFile);
        }
        const response = await authFetch(`${BASE_URL}/class`, {
            method: "POST",
            body: formData,
        });
        const result = await safeParse(response);

        if (response.ok) return { success: true, data: result.data };
        return { success: false, message: result.data?.message || "강의실 생성에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const updateClass = (gameId, data) =>
    apiCall(`${BASE_URL}/class/${encodeURIComponent(gameId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }, "강의실 수정에 실패했습니다.");

export const startClass = async (gameId, enddate) => {
    try {
        const response = await authFetch(`${BASE_URL}/class/${encodeURIComponent(gameId)}/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enddate }),
        });
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "교육 시작에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const endClass = async (gameId) => {
    try {
        const response = await authFetch(`${BASE_URL}/class/${encodeURIComponent(gameId)}/end`, { method: "POST" });
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "강의실 종료에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const restoreClass = async (gameId, enddate) => {
    try {
        const response = await authFetch(`${BASE_URL}/class/${encodeURIComponent(gameId)}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enddate }),
        });
        const result = await safeParse(response);
        if (response.ok) return { success: true };
        return { success: false, message: result.data?.message || "강의실 복원에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};
