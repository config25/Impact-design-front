import { API_BASE, publicFetch, safeParse } from "./apiConfig";

const BASE_URL = `${API_BASE}/auth`;

export const checkLoginId = async (loginId) => {
    try {
        const response = await publicFetch(`${BASE_URL}/check-id?loginId=${encodeURIComponent(loginId)}`);
        const result = await safeParse(response);

        if (response.ok) {
            return { success: true, message: result.data.message };
        }

        return { success: false, message: result.data.message };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const checkCode = async (code) => {
    try {
        const response = await publicFetch(`${BASE_URL}/check-code?code=${encodeURIComponent(code)}`);
        const result = await safeParse(response);

        if (response.ok) {
            return { success: true, teams: result.data };
        }

        return { success: false, message: result.data.message };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const login = async (loginId, password) => {
    try {
        const response = await publicFetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginId, password }),
        });
        const result = await safeParse(response);

        if (response.ok) {
            return {
                success: true,
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
            };
        }

        return { success: false, message: result.data?.message || "로그인에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const logoutApi = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    try {
        await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });
    } catch (e) {
        // 토큰 만료 등으로 실패해도 로컬 로그아웃은 진행
    }
};

export const teacherLogin = async (loginId, password) => {
    try {
        const response = await publicFetch(`${BASE_URL}/teacher/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginId, password }),
        });
        const result = await safeParse(response);

        if (response.ok) {
            return {
                success: true,
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
                userRole: result.data.userRole,
            };
        }

        return { success: false, message: result.data?.message || "로그인에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

export const signup = async (loginId, password, code, teamId) => {
    try {
        const response = await publicFetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loginId, password, code, teamId }),
        });
        const result = await safeParse(response);

        if (response.ok) {
            return { success: true, message: result.data.message };
        }

        return { success: false, message: result.data?.message || "회원가입에 실패했습니다." };
    } catch (err) {
        return { success: false, message: err.message };
    }
};
