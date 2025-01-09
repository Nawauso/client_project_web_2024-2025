import Menu from "./Menu.tsx";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable"; // Importer react-swipeable
import "../Ressources/Styles/StyleFavorite.scss";
import {useNetfluxContext} from "./ContextNetfluxProvider.tsx";
import axiosInstance from "./AxiosInstance.ts";

interface Film {
    id: number;
    title: string;
    imageUrl: string;
    overview: string;
    genre_ids: [];
}

export default function FavoritePage() {
    const [films, setFilms] = useState<Film[]>([]);
    const [currentFilmIndex, setCurrentFilmIndex] = useState<number>(0);
    const [swipeDirection, setSwipeDirection] = useState<string>("");
    const { SelectedGenres, SelectedProviders} = useNetfluxContext();


    const fetchAPI = async () => {
        try {
            const response = await axiosInstance.get("/films/favorites?genre_ids="+SelectedGenres+"&providers="+SelectedProviders); // URL de l'API
            setFilms((prevFilms) => [...prevFilms, ...response.data]); // Ajoute les nouveaux films à la liste existante
        } catch (error) {
            console.error("Erreur lors de la récupération des films :", error);
        }
    };

    // Charge les films au montage du composant
    useEffect(() => {
        fetchAPI();
    }, []);

    const getNextFilms = () => {
        if (currentFilmIndex < films.length - 1) {
            // Passe au film suivant si disponible
            setCurrentFilmIndex((prevIndex) => prevIndex + 1);
        } else {
            // Charge les nouveaux films si on atteint la fin de la liste
            fetchAPI();
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
            getNextFilms(); // Passe au film suivant après un swipe
            setSwipeDirection(""); // Réinitialiser après l'animation
        }, 500); // Temps d'animation
    };

    const currentFilm = films[currentFilmIndex]; // Film actuel basé sur l'index

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
                            src={`https://image.tmdb.org/t/p/original${currentFilm.imageUrl}`}
                            alt={currentFilm.title}
                        />
                        <h2>{currentFilm.title}</h2>
                        <p>{currentFilm.overview}</p>
                    </>
                ) : (
                    <p>Chargement des films...</p>
                )}
            </div>
            <div className="button-favorite-container">
                <button onClick={getNextFilms}>Film suivant</button>
            </div>
        </>
    );
}
