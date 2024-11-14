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
            setRandomFilm(response.data);
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
        let genre_names = "";
        genre_ids.forEach((genre_id) => {
            const genre = genres.find((genre) => genre.id === genre_id);
            if (genre) {
                genre_names += genre.name + ", ";
            }
        });
        return genre_names.slice(0, -2);
    };

    const FilmBox = ({ film }: { film: Film }) => {
        return (
            <div className="FilmBox-favorite">
                <img
                    src={`https://image.tmdb.org/t/p/original${film.poster_path}`}
                    alt={film.title}
                />
                <h1>{film.title}</h1>
                <h2>{getMovieGender(film.genre_ids)}</h2>
                <p>{film.overview}</p>
            </div>
        );
    };

    const setRandomFilm = (films: Film[]) => {
        if (films.length > 0) {
            const randomIndex = Math.floor(Math.random() * films.length);
            setCurrentFilm(films[randomIndex]);
        }
    };

    const getNewMovie = () => {
        setRandomFilm(films);
    };

    return (
        <>
            <Menu />
            <div className="film-favorite-container">
                {currentFilm ? <FilmBox film={currentFilm} /> : <p>Chargement des films...</p>}
            </div>
            <div className="button-favorite-container">
                <button onClick={getNewMovie}>Film suivant</button>
            </div>
        </>
    );
}
