import { useContext } from "react";
import { AuthContext } from "./AuthContext";

type LoginButtonProps = {
    username: string;
    password: string;
    onSuccess: () => void;
    onError: (message: string) => void;
};

export default function LoginButton({ username, password, onSuccess, onError }: LoginButtonProps) {
    const auth = useContext(AuthContext);

    async function handleLogin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();

        console.log("Tentative de connexion avec :", { username, password });

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: username, password }),
            });

            console.log("Réponse du serveur :", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Données reçues :", data);

                auth?.login(username, data.token); // Stocke le token dans le contexte et le localStorage
                console.log("Token ajouté au localStorage :", data.token);
                onSuccess();
            } else {
                const errorData = await response.json();
                console.error("Erreur du serveur :", errorData);
                onError(errorData.message || "Erreur de connexion.");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel API :", error);
            onError("Une erreur s'est produite. Veuillez réessayer.");
        }
    }

    return <button onClick={handleLogin}>Connexion</button>;
}
