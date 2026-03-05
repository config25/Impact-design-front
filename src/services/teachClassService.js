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

export const getTeachList = async () => {
    const url = isAdmin() ? `${ADMIN_BASE_URL}/list` : `${BASE_URL}/list`;
    const response = await authFetch(url);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "강의실 현황을 불러오는데 실패했습니다." };
};

export const getStudentList = async (gameId) => {
    const response = await authFetch(`${BASE_URL}/student-list?gameId=${gameId}`);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "교육생 목록을 불러오는데 실패했습니다." };
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

