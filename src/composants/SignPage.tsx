import {useNavigate} from "react-router";
import React from "react";

export function SignPage() {

    const navigate = useNavigate();


    function backToLogPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        return navigate('/login');
    }

    return (
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" required />
            <button onClick={backToLogPage}>Retour</button>
            <button type="submit">S'inscrire</button>
        </form>
    )
}