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
