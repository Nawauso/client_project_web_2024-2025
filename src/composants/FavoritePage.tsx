import Menu from "./Menu.tsx";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable"; // Importer react-swipeable
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
    const [swipeDirection, setSwipeDirection] = useState<string>("");

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

    // Gérer le swipe avec react swipeable
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe("left"),
        onSwipedRight: () => handleSwipe("right"),
        preventScrollOnSwipe: true, // Bloque le scroll vertical/latéral lors d'un swipe
        delta: 10, // Distance minimale en pixels avant de considérer un geste comme un swipe
        trackMouse: true, // Permet le test avec la souris
    });


    const handleSwipe = (direction: string) => {
        setSwipeDirection(direction === "left" ? "swipe-left" : "swipe-right");
        setTimeout(() => {
            setRandomFilm(films);
            setSwipeDirection(""); // Réinitialiser après l'animation
        }, 500); // Temps d'animation
    };

    return (
        <>
            <Menu />
            <div
                {...swipeHandlers} // Applique les gestionnaires de swipe ici
                className={`film-favorite-container ${swipeDirection}`}
            >
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
                <button onClick={() => setRandomFilm(films)}>Film suivant</button>
            </div>
        </>
    );
}
