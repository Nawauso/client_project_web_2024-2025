import Menu from "./Menu.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import "../Ressources/Styles/StyleFavorite.scss";

interface Film {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    genre_ids: [];
}

interface Genre {
    id: number;
    name: string;
}
export default function FavoritePage() {
    const [films, setFilms] = useState<Film[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [currentFilm, setCurrentFilm] = useState<Film | null>(null);

    const fetchAPI = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/films");
            setFilms(response.data);
            setRandomFilm(response.data); // Sélectionne un film au hasard
        } catch (error) {
            console.error("Erreur lors de la récupération des films :", error);
        }
    };

    const fetchAPIGenres = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/genres");
            setGenres(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des genres :", error);
        }
    };

    useEffect(() => {
        fetchAPI();
        fetchAPIGenres();
    }, []);

    const getMovieGender = (genre_ids: number[]) => {
        return genre_ids
            .map((genre_id) => {
                const genre = genres.find((genre) => genre.id === genre_id);
                return genre ? genre.name : null;
            })
            .filter(Boolean)
            .join(", ");
    };

    const setRandomFilm = (films: Film[]) => {
        if (films.length > 0) {
            const randomIndex = Math.floor(Math.random() * films.length);
            setCurrentFilm(films[randomIndex]);
        }
    };

    const getNewMovie = () => {
        setRandomFilm(films); // Met à jour uniquement les données
    };

    return (
        <>
            <Menu />
            <div className="film-favorite-container">
                {currentFilm ? (
                    <>
                        <img
                            src={`https://image.tmdb.org/t/p/original${currentFilm.poster_path}`}
                            alt={currentFilm.title}
                        />
                        <h2>{currentFilm.title}</h2>
                        <h3>{getMovieGender(currentFilm.genre_ids)}</h3>
                        <p>{currentFilm.overview}</p>
                    </>
                ) : (
                    <p>Chargement des films...</p>
                )}
            </div>
            <div className="button-favorite-container">
                <button onClick={getNewMovie}>Film suivant</button>
            </div>
        </>
    );
}
