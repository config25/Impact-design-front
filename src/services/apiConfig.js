export const API_BASE = process.env.REACT_APP_API_URL || "/api";

let globalLogout = null;
let isLoggingOut = false;

export const setGlobalLogout = (fn) => {
    globalLogout = fn;
    isLoggingOut = false;
};

export const authFetch = async (url, options = {}) => {
    const accessToken = sessionStorage.getItem("accessToken");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401 && globalLogout && !isLoggingOut) {
        isLoggingOut = true;
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        globalLogout();
    }

    return response;
};
