import {useEffect, useState} from "react";
import {Genre} from "../models/Genre";
import {Provider} from "../models/Provider";
import {fetchGenres, fetchProviders} from "./ApiService";
import axiosInstance from "./AxiosInstance";
import Menu from "./Menu";
import ProviderBox from "./ProviderBox";
import GenreBox from "./GenreBox";
import "../Ressources/Styles/StyleCriteriaPage.scss";

export default function CriteriaPage() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [g, p] = await Promise.all([fetchGenres(), fetchProviders()]);

                // ✅ NOUVEL APPEL BULK (plus d’anciennes routes giveProviders/giveGenres)
                const { data: sel } = await axiosInstance.get('/criterias/selected');

                if (!mounted) return;
                setGenres(g);
                setProviders(p);
                setSelectedGenres(Array.isArray(sel?.genres) ? sel.genres : []);
                setSelectedProviders(Array.isArray(sel?.providers) ? sel.providers : []);
            } catch (e) {
                console.error("Erreur lors du chargement des critères :", e);
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const toggleProvider = (id: number) => {
        setSelectedProviders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleGenre = (id: number) => {
        setSelectedGenres(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // ✅ ENREGISTREMENT BULK
            await axiosInstance.put('/criterias/selected', {
                genres: selectedGenres,
                providers: selectedProviders,
            });
            alert("Critères enregistrés avec succès !");
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
