import { API_BASE, apiCall, authFetch, safeParse } from "./apiConfig";

/**
 * Canvas 서비스 팩토리
 * @param {string} endpoint - API 경로 (예: "identity-canvas")
 * @param {Function} [buildBody] - save/submit 시 args → request body 변환 함수. 생략하면 첫 번째 인자를 그대로 사용
 */
export const createCanvasService = (endpoint, buildBody = (data) => data) => {
    const BASE_URL = `${API_BASE}/${endpoint}`;

    const get = () => apiCall(BASE_URL, {}, "조회에 실패했습니다.");

    const save = (...args) =>
        apiCall(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildBody(...args)),
        }, "저장에 실패했습니다.");

    const submit = async (...args) => {
        try {
            const response = await authFetch(`${BASE_URL}/submit`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildBody(...args)),
            });
            const result = await safeParse(response);

            if (response.ok) return { success: true, data: result.data };
            if (response.status === 409) return { success: false, message: "이미 제출되었습니다." };
            return { success: false, message: result.data?.message || "제출에 실패했습니다." };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    return { get, save, submit };
};
