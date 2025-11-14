export const getBackendBaseUrl = () => {
    const envBase = process.env.REACT_APP_BASE_BACKEND_URL?.trim();
    if (envBase) return envBase;

    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        return "http://localhost:5000";
    }

    return "https://msbc-backend.vercel.app";
};


