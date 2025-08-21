import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "./AxiosInstance";

type LoginButtonProps = {
    username: string;
    password: string;
    onSuccess: () => void;
    onError: (message: string) => void;
};

export default function LoginButton({ username, password, onSuccess, onError }: LoginButtonProps) {
    const auth = useContext(AuthContext);

    async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", { email: username, password });
            auth?.login(username, data.token);
            onSuccess();
        } catch (err: any) {
            let message = "Erreur de connexion. Vérifie l'email/mot de passe.";
            if (err.response) {
                const ct = (err.response.headers?.["content-type"] || "") as string;
                if (ct.includes("application/json")) message = err.response.data?.message || message;
                else message = `Erreur ${err.response.status} : ${err.response.statusText}`;
            } else if (err.request) {
                message = "Impossible de joindre le serveur. Vérifie le port/API/CORS.";
            }
            onError(message);
        }
    }

    return <button onClick={handleLogin}>Connexion</button>;
}
