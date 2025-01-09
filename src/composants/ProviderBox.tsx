import { Provider } from "../models/Provider.ts";
import { useNetfluxContext } from "./ContextNetfluxProvider.tsx";
import { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance.ts";

interface ProviderBoxProps {
    provider: Provider;
}

export default function ProviderBox({ provider }: ProviderBoxProps) {
    const { SelectedProviders, setSelectedProviders } = useNetfluxContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const fetchSelectedProviders = async () => {
            try {
                const response = await axiosInstance.get(`/criterias/give`, {
                    params: { userId: localStorage.getItem("user") }, // Récupérer userId depuis localStorage ou contexte
                });

                const selectedProviders = response.data.map((p: Provider) => p.id);

                // Vérifier si le genre actuel est dans les genres sélectionnés
                if (selectedProviders.includes(provider.id)) {
                    setIsSelected(true);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des genres sélectionnés :", error);
            }
        };

        fetchSelectedProviders();
    }, [provider.id]);

    function toggleProvider() {
        if (isSelected) {
            setSelectedProviders(SelectedProviders.filter((id) => id !== provider.id));
        } else {
            setSelectedProviders([...SelectedProviders, provider.id]);
        }
    }

    return (
        <button className={`ProviderBox ${isSelected ? "selected" : ""}`} onClick={toggleProvider}>
            <img
                src={`https://image.tmdb.org/t/p/original${provider.logoUrl}`}
                alt={`Logo de ${provider.name}`}
            />
        </button>
    );
}
