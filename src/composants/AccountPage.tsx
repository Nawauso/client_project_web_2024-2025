import Menu from "./Menu.tsx";
import "../Ressources/Styles/StyleAccountPage.scss";
import axios from "axios";
import {useEffect, useState} from "react";

interface Genre {
    id: number;
    name: string;
}


export default function AccountPage() {


    const [genres, setGenres] = useState<Genre[]>([]);

    const fetchAPI = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/genres"); // URL de l'API

            console.log(response);
        } catch (error) {
            console.error("Erreur lors de la récupération des films :", error);
        }
    };

    // useEffect pour appeler l'API au montage du composant
    useEffect(() => {
        fetchAPI();
    }, []);

    function createGenreBox(genre: Genre) {
        return <GenreBox key={genre.id} genre={genre} />;
    }

    function GenreBox({ genre }: { genre: Genre }) {
        return (
            <div className="GenreBox">
                <h1>{genre.name}</h1>
            </div>
        );
    }

    return (
        <>
            <Menu/>
            <div className="app">
                <div className="main">
                    <div className="section abonnement">
                        <h3>Sélection de l'abonnement</h3>
                        <div className="options">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
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