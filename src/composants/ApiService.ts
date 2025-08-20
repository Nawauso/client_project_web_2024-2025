import api from "./AxiosInstance";
import { Genre } from "../models/Genre";
import { Provider } from "../models/Provider";

export async function fetchGenres(): Promise<Genre[]> {
    const { data } = await api.get("/genres");
    return data ?? [];
}

export async function fetchProviders(): Promise<Provider[]> {
    const { data } = await api.get("/providers");
    return data ?? [];
}

export async function fetchSelectedCriteria(): Promise<{ genres: number[]; providers: number[] }> {
    const { data } = await api.get("/criterias/selected");
    return {
        genres: Array.isArray(data?.genres) ? data.genres : [],
        providers: Array.isArray(data?.providers) ? data.providers : [],
    };
}

export async function saveSelectedCriteria(genres: number[], providers: number[]): Promise<void> {
    await api.put("/criterias/selected", { genres, providers });
}
