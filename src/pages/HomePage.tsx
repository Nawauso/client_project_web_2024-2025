import Menu from "./Menu.tsx";
import "../assets/styles/StyleNetflux.scss";
import { useEffect, useRef, useState, useContext } from "react";
import axiosInstance from "./AxiosInstance.ts";
import { AuthContext } from "./AuthContext";

interface Film {
    id: number;
    title: string;
    imageUrl: string | null;
    overview: string;
}

type HomeResponse = {
    items: Film[];
    nextCursor?: string | null;
    notice?: string;
};

const STORAGE_KEY = "homeFeedCache_v1";

export default function NetfluxPage() {
    const auth = useContext(AuthContext);

    const [films, setFilms] = useState<Film[]>([]);
    const [cursor, setCursor] = useState<string | null | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [noticeShown, setNoticeShown] = useState(false);
    const [banner, setBanner] = useState<string | null>(null);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Charger depuis le cache au montage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as {
                    films: Film[]; cursor: string | null; allLoaded: boolean; noticeShown: boolean;
                };

                // 👉 Si le cache ne contient aucun film, on démarre un fetch,
                //    même si allLoaded/cursor disent le contraire.
                if (!parsed.films || parsed.films.length === 0) {
                    setFilms([]);
                    setCursor(undefined);
                    setAllLoaded(false);
                    setNoticeShown(false);
                    fetchMore();            // <-- force le premier appel /films/home
                    return;
                }

                setFilms(parsed.films || []);
                setCursor(parsed.cursor ?? null);
                setAllLoaded(!!parsed.allLoaded || parsed.cursor === null);
                setNoticeShown(!!parsed.noticeShown);
            } else {
                fetchMore();              // pas de cache → premier fetch
            }
        } catch {
            fetchMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.isAuthenticated]);

    // Sauvegarde du cache à chaque maj
    useEffect(() => {
        const data = JSON.stringify({ films, cursor: cursor ?? null, allLoaded, noticeShown });
        localStorage.setItem(STORAGE_KEY, data);
    }, [films, cursor, allLoaded, noticeShown]);

    const fetchMore = async () => {
        if (loading || allLoaded) return;
        setLoading(true);
        try {
            const params: any = { limit: 20 };
            if (cursor) params.cursor = cursor;

            const res = await axiosInstance.get<HomeResponse>("/films/home", { params });
            const { items, nextCursor, notice } = res.data;

            if (notice && !noticeShown) {
                setBanner(notice);
                setNoticeShown(true);
                setTimeout(() => setBanner(null), 4000);
            }

            if (!items?.length) {
                setAllLoaded(true);
                setCursor(null);
                return;
            }

            setFilms(prev => {
                const known = new Set(prev.map(f => f.id));
                const toAdd = items.filter(f => !known.has(f.id));
                return [...prev, ...toAdd];
            });

            if (!nextCursor) {
                setAllLoaded(true);
                setCursor(null);
            } else {
                setCursor(nextCursor);
            }
        } catch (e) {
            console.error("Erreur lors du chargement du flux home:", e);
        } finally {
            setLoading(false);
        }
    };

    // Scroll infini
    useEffect(() => {
        if (!sentinelRef.current) return;
        const el = sentinelRef.current;

        const io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) fetchMore();
            },
            { root: null, rootMargin: "200px", threshold: 0.01 }
        );

        io.observe(el);
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sentinelRef.current, cursor, loading, allLoaded]);

    const reset = () => {
        localStorage.removeItem(STORAGE_KEY);
        setFilms([]);
        setCursor(undefined);
        setAllLoaded(false);
        setNoticeShown(false);
        setBanner(null);
        fetchMore();
    };

    const FilmBox = ({ film }: { film: Film }) => (
        <div className="FilmBox">
            {film.imageUrl ? (
                <img src={`https://image.tmdb.org/t/p/original${film.imageUrl}`} alt={film.title} />
            ) : (
                <div className="FilmBox__placeholder">Aucune image</div>
            )}
            <h2>{film.title}</h2>
            <p>{film.overview}</p>
        </div>
    );

    return (
        <>
            <Menu />
            {banner && <div className="home-banner">{banner}</div>}

            <div className="film-container">
                {films.length ? (
                    films.map((f) => <FilmBox key={f.id} film={f} />)
                ) : (
                    <p>{loading ? "Chargement des films..." : "Aucun film à afficher."}</p>
                )}
            </div>

            <div className="controls">
                {!allLoaded && (
                    <button onClick={fetchMore} disabled={loading}>
                        {loading ? "Chargement..." : "Charger plus de films"}
                    </button>
                )}
                <button onClick={reset} className="reset-button">Réinitialiser</button>
            </div>

            {/* Sentinelle pour scroll infini */}
            <div ref={sentinelRef} style={{ height: 1 }} />
        </>
    );
}
