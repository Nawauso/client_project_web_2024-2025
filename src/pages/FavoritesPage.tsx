import Menu from "./Menu";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../assets/styles/StyleFavorite.scss";
import axiosInstance from "./AxiosInstance";
import { AuthContext } from "./AuthContext";

interface Film {
    id: number;
    title: string;
    imageUrl: string | null;
    overview: string;
    genre_ids?: number[];
    popularity?: number;
}

export default function FavoritePage() {
    const auth = useContext(AuthContext);

    const [films, setFilms] = useState<Film[]>([]);
    const [currentFilmIndex, setCurrentFilmIndex] = useState<number>(0);
    const [swipeDirection, setSwipeDirection] = useState<string>("");
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [triagedIds, setTriagedIds] = useState<Set<number>>(() => new Set<number>()); // déjà likés/dislikés
    const [skippedIds, setSkippedIds] = useState<number[]>([]); // passés
    const [secondPass, setSecondPass] = useState<boolean>(false);

    const loadingMoreRef = useRef<boolean>(false);

    // Exclure temporairement tout ce qu’on a déjà vu ou trié côté client
    const excludeIds = useMemo<number[]>(() => {
        const allSeen = new Set<number>([
            ...triagedIds,
            ...films.map((f) => f.id),
            ...skippedIds,
        ]);
        return Array.from(allSeen);
    }, [triagedIds, films, skippedIds]);

    const fetchFilms = async () => {
        if (loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setIsFetching(true);
        setError(null);

        try {
            // L’API récupère l’utilisateur via le token (AuthMiddleware)
            const response = await axiosInstance.post("/films/favorites", {
                excludeIds,
                limit: 20,
                page: 1, // le repo déduplique côté BE/FR
            });

            const newFilms: Film[] = response.data ?? [];
            setFilms((prev) => {
                const known = new Set(prev.map((f) => f.id));
                const toAdd = newFilms.filter((f) => !known.has(f.id));
                return [...prev, ...toAdd];
            });
        } catch (e: any) {
            console.error("Erreur lors de la récupération des films :", e);
            setError(e?.response?.data?.error ?? e?.message ?? "Erreur inconnue lors du chargement des films.");
        } finally {
            setIsFetching(false);
            loadingMoreRef.current = false;
        }
    };

    useEffect(() => {
        // Chargement initial (ou quand l’auth change d’état)
        setFilms([]);
        setCurrentFilmIndex(0);
        setTriagedIds(new Set<number>());
        setSkippedIds([]);
        setSecondPass(false);
        void fetchFilms(); // explicite : on ignore volontairement la Promise
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.isAuthenticated]);

    // Si tu utilises l’endpoint unifié /rank (perso + groupe), garde ceci.
    // Sinon remets ton ancien appel /groups/:groupId/rank ou /users/rank.
    const saveRank = async (filmId: number, delta: 1 | -1) => {
        try {
            await axiosInstance.post(`/rank`, { filmId, delta });
        } catch (e) {
            console.error("Erreur lors de l'enregistrement du vote :", e);
        }
    };

    const moveNext = () => {
        if (currentFilmIndex < films.length - 1) {
            setCurrentFilmIndex((i) => i + 1);
            return;
        }

        if (!isFetching) {
            fetchFilms().then(() => {
                // Après le fetch, si rien de nouveau, on repropose les skippés (seconde passe)
                setTimeout(() => {
                    const noMoreNew = films.length === 0 || currentFilmIndex >= films.length - 1;
                    if (noMoreNew && !secondPass && skippedIds.length > 0) {
                        const skippedSet = new Set(skippedIds);
                        const requeue = films.filter((f) => skippedSet.has(f.id));
                        setFilms(requeue);
                        setCurrentFilmIndex(0);
                        setSecondPass(true);
                    }
                }, 0);
            });
        }
    };

    const likeCurrent = async () => {
        const film = films[currentFilmIndex];
        if (!film) return;
        setSwipeDirection("swipe-right");
        await saveRank(film.id, 1);
        setTriagedIds((prev) => new Set(prev).add(film.id));
        setSkippedIds((prev) => prev.filter((id) => id !== film.id));
        setTimeout(() => {
            setSwipeDirection("");
            moveNext();
        }, 250);
    };

    const dislikeCurrent = async () => {
        const film = films[currentFilmIndex];
        if (!film) return;
        setSwipeDirection("swipe-left");
        await saveRank(film.id, -1);
        setTriagedIds((prev) => new Set(prev).add(film.id));
        setSkippedIds((prev) => prev.filter((id) => id !== film.id));
        setTimeout(() => {
            setSwipeDirection("");
            moveNext();
        }, 250);
    };

    const skipCurrent = () => {
        const film = films[currentFilmIndex];
        if (!film) {
            moveNext();
            return;
        }
        setSkippedIds((prev) => (prev.includes(film.id) ? prev : [...prev, film.id]));
        moveNext();
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => dislikeCurrent(),
        onSwipedRight: () => likeCurrent(),
        preventScrollOnSwipe: true,
        delta: 10,
        trackMouse: true,
    });

    const currentFilm = films[currentFilmIndex];

    return (
        <>
            <Menu />

            {error && (
                <div className="film-favorite-error">
                    <p>{error}</p>
                    <button onClick={fetchFilms} disabled={isFetching}>
                        Réessayer
                    </button>
                </div>
            )}

            <div {...swipeHandlers} className={`film-favorite-container ${swipeDirection}`}>
                {currentFilm ? (
                    <>
                        {currentFilm.imageUrl ? (
                            <img
                                src={`https://image.tmdb.org/t/p/original${currentFilm.imageUrl}`}
                                alt={currentFilm.title}
                            />
                        ) : (
                            <div className="film-favorite-placeholder">Aucune image</div>
                        )}
                        <h2>{currentFilm.title}</h2>
                        {currentFilm.overview && <p>{currentFilm.overview}</p>}
                    </>
                ) : (
                    <p>{isFetching ? "Chargement des films..." : "Aucun film disponible."}</p>
                )}
            </div>

            <div className="button-favorite-container">
                <button onClick={dislikeCurrent} disabled={isFetching || !currentFilm}>
                    Je n’aime pas
                </button>
                <button onClick={skipCurrent} disabled={isFetching || !currentFilm}>
                    Passer
                </button>
                <button onClick={likeCurrent} disabled={isFetching || !currentFilm}>
                    J’aime
                </button>
            </div>

            <div className="button-favorite-secondary">
                <button onClick={fetchFilms} disabled={isFetching}>
                    {isFetching ? "Chargement..." : "Charger d’autres films"}
                </button>
            </div>
        </>
    );
}
