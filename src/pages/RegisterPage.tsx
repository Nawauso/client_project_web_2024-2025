import { useState } from "react";
import { useNavigate } from "react-router";
import "../assets/styles/StyleLogin.scss";
import axios from "axios";

export function SignPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Gestion de l'inscription
    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                email,
                password,
            });

            if (response.status === 201) {
                setSuccess("Inscription réussie !");
                setError('');
                setTimeout(() => navigate('/login'), 2000); // Redirection après 2 secondes
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Une erreur est survenue. Veuillez réessayer.");
            }
            setSuccess('');
        }
    }

    function backToLogPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        navigate('/login');
    }

    return (
        <div className="loginPage">
            <form onSubmit={handleRegister}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Mot de passe</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button onClick={backToLogPage}>Retour</button>
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
}
