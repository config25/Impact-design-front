import { API_BASE, authFetch } from "./apiConfig";

const BASE_URL = `${API_BASE}/impact-check`;

export const getImpactCheck = async () => {
    const response = await authFetch(BASE_URL);
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "조회에 실패했습니다." };
};

export const saveImpactCheck = async (answers) => {
    const body = {};
    for (let i = 1; i <= 12; i++) {
        body[`q${i}Score`] = answers[i] ?? null;
    }
    body.q13Text = answers[13] || null;
    body.q14Text = answers[14] || null;
    body.q15Text = answers[15] || null;
    body.q16Text = answers[16] || null;

    const response = await authFetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const result = await response.json();

    if (response.ok) {
        return { success: true, data: result.data };
    }

    return { success: false, message: result.data?.message || "저장에 실패했습니다." };
};

export const submitImpactCheck = async () => {
    const response = await authFetch(`${BASE_URL}/submit`, {
        method: "PATCH",
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
