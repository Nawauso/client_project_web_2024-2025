import { useState } from "react";
import LoginButton from "./LoginButton";
import "../Ressources/Styles/StyleLogin.scss";
import { SignButton } from "./SignButton";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleLoginSuccess() {
        console.log("Connexion réussie !");
        // Ajoute ici d'autres actions après une connexion réussie si nécessaire
    }

    function handleLoginError(message: string) {
        console.log("Erreur de connexion :", message);
        setError(message);
    }

    return (
        <div className="loginPage">
            <form>
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <LoginButton
                    username={username}
                    password={password}
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                />
                <SignButton />
            </form>
        </div>
    );
}
