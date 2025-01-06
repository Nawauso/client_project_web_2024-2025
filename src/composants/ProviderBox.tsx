import { Provider } from "../models/Provider.ts";

interface ProviderBoxProps {
    provider: Provider;
}

export default function ProviderBox({ provider }: ProviderBoxProps) {
    return (
        <button className="ProviderBox">
            <img
                src={`https://image.tmdb.org/t/p/original${provider.logoUrl}`}
                alt={`Logo de ${provider.name}`}
            />
        </button>
    );
}
