import Menu from "./Menu.tsx";
import "../Ressources/Styles/StyleNetflux.scss";
import { useEffect, useState, useContext } from "react";
import axiosInstance from "./AxiosInstance.ts";
import { AuthContext } from "./AuthContext";

interface Film {
    id: number;
    title: string;
    imageUrl: string;
    overview: string;
}

export default function NetfluxPage() {
    const [films, setFilms] = useState<Film[]>([]);
    const [loading, setLoading] = useState(false);
    const [allFilmsLoaded, setAllFilmsLoaded] = useState(false);

    const auth = useContext(AuthContext);

    const fetchAPIFilms = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/films");
            const newFilms = response.data;

            if (newFilms.length === 0) {
                setAllFilmsLoaded(true); // Plus de films à charger
            } else {
                setFilms((prevFilms) => [...prevFilms, ...newFilms]); // Ajouter les nouveaux films
            }
        } catch (error: any) {
            console.error("Erreur lors de la récupération des films :", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                auth?.logout(); // Déconnecte l'utilisateur si le token est invalide
            }
        } finally {
            setLoading(false);
        }
    };

    const resetPagination = async () => {
        try {
            await axiosInstance.post("/films/reset-pagination");
            setFilms([]); // Réinitialise la liste des films côté client
            setAllFilmsLoaded(false); // Autorise le chargement des films
            fetchAPIFilms(); // Recharge les premiers films
        } catch (error: any) {
            console.error("Erreur lors de la réinitialisation de la pagination :", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                auth?.logout(); // Déconnecte l'utilisateur si le token est invalide
            }
        }
    };

    // Charger les premiers films au montage du composant
    useEffect(() => {
        fetchAPIFilms();
    }, []);

    // Fonction pour créer un FilmBox pour chaque film
    function createFilmBox(film: Film) {
        return <FilmBox key={film.id} film={film} />;
    }

    function FilmBox({ film }: { film: Film }) {
        return (
            <div className="FilmBox">
                <img src={`https://image.tmdb.org/t/p/original${film.imageUrl}`} alt={film.title} />
                <h2>{film.title}</h2>
                <p>{film.overview}</p>
            </div>
        );
    }

    return (
        <>
            <Menu />
            <div className="film-container">
                {films.length > 0 ? (
                    films.map((film) => createFilmBox(film)) // Mapper sur les films récupérés pour afficher chaque FilmBox
                ) : (
                    <p>{loading ? "Chargement des films..." : "Aucun film à afficher."}</p>
                )}
            </div>

            {!allFilmsLoaded && (
                <button onClick={fetchAPIFilms} disabled={loading}>
                    {loading ? "Chargement..." : "Charger plus de films"}
                </button>
            )}

            <button onClick={resetPagination} className="reset-button">
                Réinitialiser
            </button>
        </>
    );
}
