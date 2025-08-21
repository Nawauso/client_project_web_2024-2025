import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "./AxiosInstance.ts";
import { useNetfluxContext } from "./ContextNetfluxProvider.tsx";

type AuthContextType = {
    user: string | null;
    token: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const loadFromStorage = (key: string, defaultValue: string | null) => {
        const stored = localStorage.getItem(key);
        return stored !== null ? stored : defaultValue;
    };

    const [user, setUser] = useState<string | null>(() => loadFromStorage("user", null));
    const [token, setToken] = useState<string | null>(() => loadFromStorage("token", null));

    const navigate = useNavigate();
    const { setSelectedGenres, setSelectedProviders } = useNetfluxContext();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            const verifyToken = async () => {
                try {
                    const response = await axiosInstance.get("/auth/verify");
                    if (response.status === 200) {
                        setToken(storedToken);
                        setUser(storedUser);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification du token :", error);
                    logout();
                }
            };
            verifyToken();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Utile pour debug
        // console.log("AuthProvider: token updated", token);
    }, [token]);

    const login = (username: string, newToken: string) => {
        setUser(username);
        setToken(newToken);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", username);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setSelectedGenres([]);
        setSelectedProviders([]);
        navigate("/login");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
