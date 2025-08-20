import { Provider } from "../models/Provider";

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
            <img src={provider.logoUrl} alt={`Logo de ${provider.name}`} />
        </button>
    );
}
