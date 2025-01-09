import {useNetfluxContext} from "./ContextNetfluxProvider.tsx";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthContext.tsx";
import {Genre} from "../models/Genre.ts";
import {fetchGenres, fetchProviders} from "./ApiService.ts";
import {Provider} from "../models/Provider.ts";
import axiosInstance from "./AxiosInstance.ts";
import Menu from "./Menu.tsx";
import ProviderBox from "./ProviderBox.tsx";
import GenreBox from "./GenreBox.tsx";

export default function CriteriaPage() {
    const { SelectedGenres, SelectedProviders } = useNetfluxContext();
    const user = useContext(AuthContext); // User reste une string
    const [genres, setGenres] = useState<Genre[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genresData, providersData] = await Promise.all([
                    fetchGenres(),
                    fetchProviders(),
                ]);
                setGenres(genresData);
                setProviders(providersData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (!user) {
                alert("Utilisateur non connecté ou email manquant.");
                setIsSaving(false);
                return;
            }

            await axiosInstance.post(`/criterias`, {
                userId: user.user, // Envoyer l'email de l'utilisateur comme `userId`
                genreIds: SelectedGenres,
                providerIds: SelectedProviders,
            });
            alert("Critères enregistrés avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des critères :", error);
            alert("Une erreur s'est produite lors de l'enregistrement des critères.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Menu />
            <div className="app">
                <div className="main">
                    <div className="section abonnement">
                        <h3>Sélection de l'abonnement</h3>
                        <div className="provider-container">
                            {isLoading ? (
                                <p>Chargement des abonnements...</p>
                            ) : providers.length > 0 ? (
                                providers.map((provider) => (
                                    <ProviderBox key={provider.id} provider={provider} />
                                ))
                            ) : (
                                <p>Aucun abonnement disponible.</p>
                            )}
                        </div>
                    </div>
                    <div className="section genre">
                        <h3>Sélection des genres</h3>
                        <div className="genre-container">
                            {isLoading ? (
                                <p>Chargement des genres...</p>
                            ) : genres.length > 0 ? (
                                genres.map((genre) => (
                                    <GenreBox key={genre.id} genre={genre} />
                                ))
                            ) : (
                                <p>Aucun genre disponible.</p>
                            )}
                        </div>
                    </div>
                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={isSaving || SelectedGenres.length === 0 || SelectedProviders.length === 0}
                    >
                        {isSaving ? "Enregistrement en cours..." : "Enregistrement des critères"}
                    </button>
                </div>
            </div>
        </>
    );
}
