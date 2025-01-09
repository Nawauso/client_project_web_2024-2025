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
                const response = await axiosInstance.get(`/criterias/giveProviders`, {
                    params: { userId: localStorage.getItem("user") },
                });

                const selectedProviders = response.data.map((p: Provider) => p.id);
                setSelectedProviders(selectedProviders);

                if (selectedProviders.includes(provider.id)) {
                    setIsSelected(true);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des providers sélectionnés :", error);
            }
        };

        fetchSelectedProviders();
    }, [provider.id, setSelectedProviders]);

    function toggleProvider() {
        if (isSelected) {
            setSelectedProviders(SelectedProviders.filter((id) => id !== provider.id));
            setIsSelected(false);
        } else {
            setSelectedProviders([...SelectedProviders, provider.id]);
            setIsSelected(true);
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
