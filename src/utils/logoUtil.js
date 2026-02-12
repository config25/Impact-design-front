import { API_BASE } from "../services/apiConfig";

const SERVER_BASE = API_BASE.replace("/api", "");

export const getLogoUrl = (gameLogo) => {
    if (!gameLogo || !gameLogo.newFilenm) return null;
    return `${SERVER_BASE}${gameLogo.extDir}${gameLogo.newFilenm}`;
};

export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${SERVER_BASE}${imageUrl}`;
};
