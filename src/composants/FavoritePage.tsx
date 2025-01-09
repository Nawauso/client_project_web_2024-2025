import Menu from "./Menu.tsx";
import { useContext, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../Ressources/Styles/StyleFavorite.scss";
import axiosInstance from "./AxiosInstance.ts";
import { AuthContext } from "./AuthContext.tsx";

interface Film {
    id: number;
    title: string;
    imageUrl: string;
    overview: string;
    genre_ids: number[];
}

export default function FavoritePage() {
    const [films, setFilms] = useState<Film[]>([]);
    const [currentFilmIndex, setCurrentFilmIndex] = useState<number>(0);
    const [swipeDirection, setSwipeDirection] = useState<string>("");
    const [isFetching, setIsFetching] = useState(false);
    const user = useContext(AuthContext);

    // Charger les films directement depuis le serveur
    const fetchFilms = async () => {
        setIsFetching(true);
        try {
            const response = await axiosInstance.post("/films/favorites", {
                userId: user?.user, // Envoyer l'ID utilisateur dans le body
            });

            setFilms((prevFilms) => [...prevFilms, ...response.data]); // Ajouter les nouveaux films
        } catch (error) {
            console.error("Erreur lors de la récupération des films :", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchFilms(); // Charger les films au montage du composant
    }, []);

    const getNextFilms = () => {
        if (currentFilmIndex < films.length - 1) {
            setCurrentFilmIndex((prevIndex) => prevIndex + 1);
        } else {
            fetchFilms(); // Charger les nouveaux films si on atteint la fin de la liste
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe("left"),
        onSwipedRight: () => handleSwipe("right"),
        preventScrollOnSwipe: true,
        delta: 10,
        trackMouse: true,
    });

    const handleSwipe = (direction: string) => {
        setSwipeDirection(direction === "left" ? "swipe-left" : "swipe-right");
        setTimeout(() => {
            getNextFilms();
            setSwipeDirection("");
        }, 500);
    };

    const currentFilm = films[currentFilmIndex];

    return (
        <>
            <Menu />
            <div
                {...swipeHandlers}
                className={`film-favorite-container ${swipeDirection}`}
            >
                {currentFilm ? (
                    <>
                        <img
                            src={`https://image.tmdb.org/t/p/original${currentFilm.imageUrl}`}
                            alt={currentFilm.title}
                        />
                        <h2>{currentFilm.title}</h2>
                        <p>{currentFilm.overview}</p>
                    </>
                ) : (
                    <p>{isFetching ? "Chargement des films..." : "Aucun film disponible."}</p>
                )}
            </div>
            <div className="button-favorite-container">
                <button onClick={getNextFilms} disabled={isFetching}>
                    {isFetching ? "Chargement..." : "Film suivant"}
                </button>
            </div>
        </>
    );
}
