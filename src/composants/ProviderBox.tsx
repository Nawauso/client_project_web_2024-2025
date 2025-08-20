import { Provider } from "../models/Provider.ts";

type ProviderBoxProps = {
    provider: Provider;
    selected: boolean;
    onToggle: (id: number) => void;
};

export default function ProviderBox({ provider, selected, onToggle }: ProviderBoxProps) {
    return (
        <button
            className={`ProviderBox ${selected ? "selected" : ""}`}
            onClick={() => onToggle(provider.id)}
            title={provider.name}
            type="button"
        >
            {/* ⚠️ Si ton seed stocke déjà l’URL complète, utilise directement provider.logoUrl */}
            <img src={provider.logoUrl} alt={`Logo de ${provider.name}`} />
        </button>
    );
}
