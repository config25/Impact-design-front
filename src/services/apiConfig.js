export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

let globalLogout = null;

export const setGlobalLogout = (fn) => {
    globalLogout = fn;
};

export const authFetch = async (url, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401 && globalLogout) {
        globalLogout();
        return response;
    }

    return response;
};
