import {
    createContext,
    useContext,
    useMemo,
    useState,
    ReactNode,
    useEffect,
} from "react";

/**
 * Contexte global Netflux :
 * - selectedGenres : ids de genres choisis
 * - selectedProviders : ids de fournisseurs choisis
 * - groupId : identifiant de groupe courant (optionnel)
 *
 * Fourni pour que CriteriaPage et FavoritePage partagent les mêmes sélections.
 */

type NetfluxContextType = {
    selectedGenres: number[];
    selectedProviders: number[];
    groupId: string | null;

    setSelectedGenres: (ids: number[]) => void;
    setSelectedProviders: (ids: number[]) => void;
    setGroupId: (id: string | null) => void;
};

const NetfluxContext = createContext<NetfluxContextType | undefined>(undefined);

export function ContextNetfluxProvider({ children }: { children: ReactNode }) {
    const [selectedGenres, setSelectedGenresState] = useState<number[]>([]);
    const [selectedProviders, setSelectedProvidersState] = useState<number[]>([]);
    const [groupId, setGroupIdState] = useState<string | null>(null);

    // Hydratation initiale depuis localStorage pour conserver l’état après refresh
    useEffect(() => {
        try {
            const g = localStorage.getItem("netflux:selectedGenres");
            const p = localStorage.getItem("netflux:selectedProviders");
            const grp = localStorage.getItem("netflux:groupId");
            if (g) setSelectedGenresState(JSON.parse(g));
            if (p) setSelectedProvidersState(JSON.parse(p));
            if (grp) setGroupIdState(grp);
        } catch {
            // ignore en cas d’erreur JSON/localStorage
        }
    }, []);

    const setSelectedGenres = (ids: number[]) => {
        setSelectedGenresState(ids);
        try {
            localStorage.setItem("netflux:selectedGenres", JSON.stringify(ids));
        } catch {
            // ignore
        }
    };

    const setSelectedProviders = (ids: number[]) => {
        setSelectedProvidersState(ids);
        try {
            localStorage.setItem("netflux:selectedProviders", JSON.stringify(ids));
        } catch {
            // ignore
        }
    };

    const setGroupId = (id: string | null) => {
        setGroupIdState(id);
        try {
            if (id) localStorage.setItem("netflux:groupId", id);
            else localStorage.removeItem("netflux:groupId");
        } catch {
            // ignore
        }
    };

    const value = useMemo<NetfluxContextType>(
        () => ({
            selectedGenres,
            selectedProviders,
            groupId,
            setSelectedGenres,
            setSelectedProviders,
            setGroupId,
        }),
        [selectedGenres, selectedProviders, groupId]
    );

    return <NetfluxContext.Provider value={value}>{children}</NetfluxContext.Provider>;
}

export function useNetfluxContext() {
    const ctx = useContext(NetfluxContext);
    if (!ctx) {
        throw new Error("useNetfluxContext doit être utilisé dans <ContextNetfluxProvider />");
    }
    return ctx;
}
