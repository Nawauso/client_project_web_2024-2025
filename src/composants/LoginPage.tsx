//date : 06/10/2024

import {useState} from "react";
import LoginButton from "./LoginButton.tsx";
import "../Ressources/Styles/StyleLogin.scss";
import {SignButton} from "./SignButton.tsx";

export default function LoginPage() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="loginPage">
        <form>
            <label htmlFor="username">Nom d'utilisateur</label>
            <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Mot de passe</label>
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            <LoginButton />
            <SignButton />
        </form>
        </div>
    )
}