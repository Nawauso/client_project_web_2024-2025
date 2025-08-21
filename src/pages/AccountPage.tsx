import { useEffect, useState } from "react";
import "wStyleAccountPage.scss";
import axiosInstance from "../api/AxiosInstance";
import Menu from "../components/layout/Navbar.tsx";

export default function AccountPage() {
    const [group, setGroup] = useState<any>(null); // Stocke les données du groupe
    const [groupName, setGroupName] = useState<string>(""); // Nom du groupe saisi par l'utilisateur
    const [inGroup, setInGroup] = useState<boolean>(false); // Indique si l'utilisateur est dans un groupe
    const [message, setMessage] = useState<string>(""); // Messages d'erreur ou de succès

    // Récupère les informations du groupe de l'utilisateur
    const fetchGroupData = async () => {
        try {
            const response = await axiosInstance.get("/groups/my-group");
            setInGroup(response.data.inGroup);
            if (response.data.inGroup) {
                setGroup(response.data.group); // Stocke les informations du groupe
            } else {
                setGroup(null); // Réinitialise si l'utilisateur n'a pas de groupe
            }
        } catch (error: any) {
            console.error("Erreur lors de la récupération du groupe :", error);
            setMessage("Impossible de récupérer les informations du groupe.");
        }
    };

    // Gestion de la création d'un groupe
    const handleCreateGroup = async () => {
        try {
            const response = await axiosInstance.post("/groups/create", { groupName });
            setMessage(response.data.message);
            fetchGroupData(); // Recharge les informations du groupe
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Erreur lors de la création du groupe.");
        }
    };

    // Gestion de rejoindre un groupe existant
    const handleJoinGroup = async () => {
        try {
            const response = await axiosInstance.post("/groups/join", { groupName });
            setMessage(response.data.message);
            fetchGroupData(); // Recharge les informations du groupe
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Erreur lors de la jonction au groupe.");
        }
    };

    useEffect(() => {
        fetchGroupData(); // Récupère les informations au chargement
    }, []);

    return (
        <>
            <Menu />
            <div className="account-page">
                {message && <p>{message}</p>}

                {inGroup ? (
                    // Si l'utilisateur est dans un groupe, affiche les informations
                    <div>
                        <h2>Vous êtes dans le groupe : {group?.name}</h2>
                        <h3>Membres :</h3>
                        {group?.user?.length ? (
                            <ul>
                                {group.user.map((member: any) => (
                                    <li key={member.id}>{member.email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucun membre dans ce groupe.</p>
                        )}
                    </div>
                ) : (
                    // Si l'utilisateur n'est pas dans un groupe, propose de rejoindre ou créer
                    <div>
                        <h2>Vous n'êtes dans aucun groupe.</h2>
                        <input
                            type="text"
                            placeholder="Nom du groupe"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button onClick={handleCreateGroup}>Créer un groupe</button>
                        <button onClick={handleJoinGroup}>Rejoindre un groupe</button>
                    </div>
                )}
            </div>
        </>
    );
}
