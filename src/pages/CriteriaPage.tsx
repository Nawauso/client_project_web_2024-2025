import { useEffect, useState } from "react";
import { Genre } from "../models/Genre";
import { Provider } from "../models/Provider";
import {
    fetchGenres,
    fetchProviders,
    fetchSelectedCriteria,
    saveSelectedCriteria,
} from "../api/ApiService";
import Menu from "../components/layout/Navbar.tsx";
import ProviderBox from "../components/preferences/ProviderCard.tsx";
import GenreBox from "../components/preferences/GenreCard.tsx";
import { useNetfluxContext } from "../context/NetfluxContextProvider.tsx";
import "../assets/styles/Styles/StyleCriteriaPage.scss";

export default function CriteriaPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Contexte global (FavoritePage lit ces valeurs)
    const {
        setSelectedGenres: setCtxGenres,
        setSelectedProviders: setCtxProviders,
    } = useNetfluxContext();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [g, p, sel] = await Promise.all([
                    fetchGenres(),
                    fetchProviders(),
                    fetchSelectedCriteria(),
                ]);
                if (!mounted) return;

                setGenres(g);
                setProviders(p);
                setSelectedGenres(sel.genres ?? []);
                setSelectedProviders(sel.providers ?? []);

            } catch (e) {
                console.error("Erreur lors du chargement des critères :", e);
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleProvider = (id: number) => {
        setSelectedProviders((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            setCtxProviders(next); // garder le contexte en phase
            return next;
        });
    };

    const toggleGenre = (id: number) => {
        setSelectedGenres((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            setCtxGenres(next); // garder le contexte en phase
            return next;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveSelectedCriteria(selectedGenres, selectedProviders);
            // Mettre à jour le contexte (par sécurité)
            setCtxGenres(selectedGenres);
            setCtxProviders(selectedProviders);
            alert("Critères enregistrés avec succès !");
            // ❌ plus de navigation automatique
        } catch (e) {
            console.error("Erreur lors de l'enregistrement des critères :", e);
            alert("Une erreur s'est produite lors de l'enregistrement des critères.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Menu />
            <div className="app">
                <div className="main">
                    <div className="section abonnement">
                        <h3>Sélection de l'abonnement</h3>
                        <div className="genre-container">
                            {isLoading ? (
                                <p>Chargement des abonnements...</p>
                            ) : providers.length ? (
                                providers.map((provider) => (
                                    <ProviderBox
                                        key={provider.id}
                                        provider={provider}
                                        selected={selectedProviders.includes(provider.id)}
                                        onToggle={toggleProvider}
                                    />
                                ))
                            ) : (
                                <p>Aucun abonnement disponible.</p>
                            )}
                        </div>
                    </div>

                    <div className="section genre">
                        <h3>Sélection des genres</h3>
                        <div className="genre-container">
                            {isLoading ? (
                                <p>Chargement des genres...</p>
                            ) : genres.length ? (
                                genres.map((genre) => (
                                    <GenreBox
                                        key={genre.id}
                                        genre={genre}
                                        selected={selectedGenres.includes(genre.id)}
                                        onToggle={toggleGenre}
                                    />
                                ))
                            ) : (
                                <p>Aucun genre disponible.</p>
                            )}
                        </div>
                    </div>

                    <button className="save-button" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Enregistrement en cours..." : "Enregistrement des critères"}
                    </button>
                </div>
            </div>
        </>
    );
}
