import Menu from "./Menu.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import "../Ressources/Styles/StyleCriteriaPage.scss";

interface Genre {
    id: number;
    name: string;
}

interface Provider {
    "logo_Path": string,
    "provider_Name": string,
    "provider_ID": number
}

export default function CriteriaPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);

    const fetchAPIGenres = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/genres"); // URL de l'API
            setGenres(response.data);
            console.log(response);
        } catch (error) {
            console.error("Erreur lors de la récupération des genres :", error);
        }
    };

    async function fetchAPIProviders() {
        try {
            const response = await axios.get("http://localhost:8080/api/providers"); // URL de l'API
            setProviders(response.data);
            console.log(response);
        } catch (error) {
            console.error("Erreur lors de la récupération des providers :", error);
        }
    }

    // useEffect pour appeler l'API au montage du composant
    useEffect(() => {
        fetchAPIGenres();
        fetchAPIProviders();
    }, []);

    function createGenreBox(genre: Genre) {
        return <GenreBox key={genre.id} genre={genre} />;
    }

    function GenreBox({ genre }: { genre: Genre }) {
        return (
            <button className="GenreBox">
                {genre.name}
            </button>
        );
    }

    function createProviderBox(providers: Provider) {
        return <ProviderBox key={providers.provider_ID} provider={providers} />;
    }

    function ProviderBox({ provider }: { provider: Provider }) {
        return (
            <button className="ProviderBox">
                <img
                    src={`https://image.tmdb.org/t/p/original${provider.logo_Path}`}
                    alt={`Logo de ${provider.provider_Name}`}
                />
                {/*<p>{provider.provider_Name}</p>*/}
            </button>
        );
    }


    return (
        <>
            <Menu/>
            <div className="app">
                <div className="main">
                    <div className="section abonnement">
                        <h3>Sélection de l'abonnement</h3>
                        <div className="genre-container">
                            {providers.length > 0 ? (
                                providers.map((provider) => createProviderBox(provider)) // Mapper sur les genres récupérés pour afficher chaque GenreBox
                            ) : (
                                <p>Chargement des genres...</p>
                            )}
                        </div>
                    </div>
                    <div className="section genre">
                        <h3>Sélection des genres</h3>
                        <div className="genre-container">
                            {genres.length > 0 ? (
                                genres.map((genre) => createGenreBox(genre)) // Mapper sur les genres récupérés pour afficher chaque GenreBox
                            ) : (
                                <p>Chargement des genres...</p>
                            )}
                        </div>
                    </div>
                    <button className="save-button">Enregistrement des critères</button>
                </div>
            </div>
        </>
    )
}