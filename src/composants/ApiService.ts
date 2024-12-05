import axios from "axios";
import { Genre} from "../models/Genre.ts";
import { Provider } from "../models/Provider.ts";

const API_BASE_URL = "http://localhost:8080/api";

export const fetchGenres = async (): Promise<Genre[]> => {
    const response = await axios.get<Genre[]>(`${API_BASE_URL}/genres`);
    return response.data;
};

export const fetchProviders = async (): Promise<Provider[]> => {
    const response = await axios.get<Provider[]>(`${API_BASE_URL}/providers`);
    return response.data;
};
