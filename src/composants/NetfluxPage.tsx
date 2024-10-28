//date : 07/10/2024
import Menu from "./Menu.tsx";
import "../Ressources/Styles/StyleNetflux.scss";
import {useEffect, useState} from "react";
import axios from "axios";

interface Film {
    id: number;
    title: string;
    imageUrl: string;
    overview: string;
}

export default function NetfluxPage() {

    const [films, setFilms] = useState<Film[]>([]);

    const fetchAPI = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/films"); // URL de l'API
            setFilms(response.data.genres[0]); // Met à jour l'état avec les données récupérées
        } catch (error) {
            console.error("Erreur lors de la récupération des films :", error);
        }
    };

    // useEffect pour appeler l'API au montage du composant
    useEffect(() => {
        fetchAPI();
    }, []);

    // Fonction pour créer un FilmBox pour chaque film
    function createFilmBox(film: Film) {
        return <FilmBox key={film.id} film={film} />;
    }

    function FilmBox({ film }: { film: Film }) {
        return (
            <div className="FilmBox">
                <h1>{film.title}</h1>
                <img src={film.imageUrl} alt={film.title}/>
                <p>{film.overview}</p> {/* Affiche directement la description complète */}
            </div>
        );
    }

    return (
        <>
            <Menu />

            <h1>Netflux</h1>
            <div className="film-container">
                {films.length > 0 ? (
                    films.map((film) => createFilmBox(film)) // Mapper sur les films récupérés pour afficher chaque FilmBox
                ) : (
                    <p>Chargement des films...</p>
                )}
            </div>
        </>
    );
}
