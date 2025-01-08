import { Provider } from "../models/Provider.ts";
import { useNetfluxContext } from "./ContextNetfluxProvider.tsx";
import {useEffect, useState} from "react";

interface ProviderBoxProps {
    provider: Provider;
}
export default function ProviderBox({ provider }: ProviderBoxProps) {
    const { SelectedProviders, setSelectedProviders } = useNetfluxContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        if (SelectedProviders.includes(provider.id)) {
            setIsSelected(true);
        }
    }, []);

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
