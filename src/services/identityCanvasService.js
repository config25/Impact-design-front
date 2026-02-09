import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/identity-canvas`;

export const getIdentityCanvas = async () => {
    const response = await authFetch(BASE_URL);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "조회에 실패했습니다." };
};

export const saveIdentityCanvas = async (values) => {
    const response = await authFetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "저장에 실패했습니다." };
};

export const submitIdentityCanvas = async () => {
    const response = await authFetch(`${BASE_URL}/submit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    if (response.status === 409) {
        return { success: false, message: "이미 제출되었습니다." };
    }

    return { success: false, message: result.data?.message || "제출에 실패했습니다." };
};
