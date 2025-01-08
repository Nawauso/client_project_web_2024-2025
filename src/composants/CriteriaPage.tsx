import { useEffect, useState } from "react";
import Menu from "./Menu";
import "../Ressources/Styles/StyleCriteriaPage.scss";
import { fetchGenres, fetchProviders } from "./ApiService";
import { Genre} from "../models/Genre.ts";
import { Provider } from "../models/Provider.ts";
import GenreBox from "./GenreBox";
import ProviderBox from "./ProviderBox";


export default function CriteriaPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genresData, providersData] = await Promise.all([
                    fetchGenres(),
                    fetchProviders(),
                ]);
                setGenres(genresData);
                setProviders(providersData);
                //console.log("Genres et providers récupérés :", genresData, providers);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Menu />
            <div className="app">
                <div className="main">
                    <div className="section abonnement">
                        <h3>Sélection de l'abonnement</h3>
                        <div className="genre-container">
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
                    <button className="save-button">Enregistrement des critères</button>
                </div>
            </div>
        </>
    );
}
