import { createContext, ReactNode, useContext, useState, useEffect } from "react";

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
        if(SelectedGenres === null){
            loadFromStorage("SelectedGenres", [])
        }
        localStorage.setItem("SelectedGenres", JSON.stringify(SelectedGenres));
    }, [SelectedGenres]);

    useEffect(() => {
        if(SelectedGenres === null){
            loadFromStorage("SelectedProviders", [])
        }
        localStorage.setItem("SelectedProviders", JSON.stringify(SelectedProviders));
    }, [SelectedProviders]);




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
