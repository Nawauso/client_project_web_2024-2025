import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router";

type AuthContextType = {
    user: string | null;
    token: string | null;
    login: (username: string, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const loadFromStorage = (key: string, defaultValue: any) => {
        const stored = localStorage.getItem(key);
        return stored !== null ? stored : defaultValue;
    };
    const [user, setUser] = useState<string>(() => loadFromStorage("user", null));
    const [token, setToken] = useState<string>(() => loadFromStorage("token", null));
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        console.log("LocalStorage: storedToken", storedToken);
        console.log("LocalStorage: storedUser", storedUser);
        if (storedToken && storedUser) {
            console.log(token)
            setToken(storedToken);
            console.log(token)
            setUser(storedUser);

        }
    }, []);

    useEffect(() => {
        console.log("AuthProvider: token updated", token);
    }, [token]);

    const login = (username: string, newToken: string) => {
        setUser(username);
        setToken(newToken);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", username);
    };

    const logout = () => {
        //setUser(null);
        //setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}