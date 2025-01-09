import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import axiosInstance from "./AxiosInstance.ts";
import {Genre} from "../models/Genre.ts";
import {Provider} from "../models/Provider.ts";

// Interface pour le type du contexte
interface ContextType {
    SelectedGenres: number[];
    setSelectedGenres: (value: number[]) => void;
    SelectedProviders: number[];
    setSelectedProviders: (value: number[]) => void;
}

// Interface pour les props du provider
interface ContextProviderProps {
    children: ReactNode;
}

// Création du contexte avec un type optionnel (undefined au départ)
const contextNetfluxProvider = createContext<ContextType | undefined>(undefined);

// Fournisseur de contexte pour Netflux
export const ContextNetfluxProvider = ({ children }: ContextProviderProps) => {
    // Charger les données depuis localStorage
    const loadFromStorage = (key: string, defaultValue: any) => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    };

    // États partagés dans le contexte, avec initialisation depuis localStorage
    const [SelectedGenres, setSelectedGenres] = useState<number[]>(() =>
        loadFromStorage("SelectedGenres", [])
    );
    const [SelectedProviders, setSelectedProviders] = useState<number[]>(() =>
        loadFromStorage("SelectedProviders", [])
    );

    // Sauvegarder dans localStorage à chaque modification
    useEffect(() => {
        localStorage.setItem("SelectedGenres", JSON.stringify(SelectedGenres));
    }, [SelectedGenres]);

    useEffect(() => {
        localStorage.setItem("SelectedProviders", JSON.stringify(SelectedProviders));
    }, [SelectedProviders]);

    const initializeFromServer = async (userId: string) => {
        try {
            const response = await axiosInstance.get(`/criterias/give`, {
                params: { userId },
            });
            const { genres, providers } = response.data;

            // Mettre à jour les états avec les données du serveur
            setSelectedGenres(genres.map((genre: Genre) => genre.id));
            setSelectedProviders(providers.map((provider: Provider) => provider.id));
        } catch (error) {
            console.error("Erreur lors de la récupération des données du serveur :", error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userEmail"); // Récupérer l'email de l'utilisateur (ou autre identifiant)
        if (userId) {
            initializeFromServer(userId);
        }
    }, []);

    return (
        <contextNetfluxProvider.Provider
            value={{
                SelectedGenres,
                setSelectedGenres,
                SelectedProviders,
                setSelectedProviders,
            }}
        >
            {children}
        </contextNetfluxProvider.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte Netflux
export const useNetfluxContext = (): ContextType => {
    const context = useContext(contextNetfluxProvider);
    if (!context) {
        throw new Error("useNetfluxContext must be used within a ContextNetfluxProvider");
    }
    return context;
};
