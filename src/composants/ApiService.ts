import { Genre} from "../models/Genre.ts";
import { Provider } from "../models/Provider.ts";
import axiosInstance from "./AxiosInstance.ts";

export const fetchGenres = async (): Promise<Genre[]> => {
    const response = await axiosInstance.get<Genre[]>('/genres');
    return response.data;
};

export const fetchProviders = async (): Promise<Provider[]> => {
    const response = await axiosInstance.get<Provider[]>('/providers');
    return response.data;
};
