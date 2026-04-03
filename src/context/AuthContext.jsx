import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "msbc_dashboard_auth";

const AuthContext = createContext({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.token) {
                    setToken(parsed.token);
                    setUser(parsed.user || null);
                }
            }
        } catch (err) {
            console.error("Failed to read auth storage:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (authToken, authUser) => {
        setToken(authToken);
        setUser(authUser);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                token: authToken,
                user: authUser,
                timestamp: Date.now(),
            })
        );
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(
        () => ({
            isAuthenticated: Boolean(token),
            token,
            user,
            loading,
            login,
            logout,
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


