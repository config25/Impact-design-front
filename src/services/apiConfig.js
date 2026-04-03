export const API_BASE = process.env.REACT_APP_API_URL || "/api";

let globalLogout = null;
let isLoggingOut = false;

export const setGlobalLogout = (fn) => {
    globalLogout = fn;
    isLoggingOut = false;
};

export const setLoggingOut = () => {
    isLoggingOut = true;
};

export const authFetch = async (url, options = {}) => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken && globalLogout && !isLoggingOut) {
        isLoggingOut = true;
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        globalLogout();
        throw new Error("로그인 정보가 없습니다.");
    }

    let response;
    try {
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${accessToken}`,
            },
        });
    } catch (err) {
        throw new Error("서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
    }

    if (response.status === 401 && globalLogout && !isLoggingOut) {
        isLoggingOut = true;
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        globalLogout();
    }

    return response;
};

export const safeParse = async (response) => {
    try {
        return await response.json();
    } catch {
        return { data: { message: "서버 응답을 처리할 수 없습니다." } };
    }
};

// 인증 필요 API 공통 래퍼
export const apiCall = async (url, options = {}, errorMsg = "요청에 실패했습니다.") => {
    try {
        const response = await authFetch(url, options);
        const result = await safeParse(response);
        if (response.ok) return { success: true, data: result.data };
        return { success: false, message: result.data?.message || errorMsg };
    } catch (err) {
        return { success: false, message: err.message };
    }
};

// 비인증 API (로그인/회원가입 등)
export const publicFetch = async (url, options = {}) => {
    try {
        return await fetch(url, options);
    } catch {
        throw new Error("서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
    }
};

