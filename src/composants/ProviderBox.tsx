import { Provider } from "../models/Provider.ts";

interface ProviderBoxProps {
    provider: Provider;
}

export default function ProviderBox({ provider }: ProviderBoxProps) {
    return (
        <button className="ProviderBox">
            <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_Path}`}
                alt={`Logo de ${provider.provider_Name}`}
            />
        </button>
    );
}
