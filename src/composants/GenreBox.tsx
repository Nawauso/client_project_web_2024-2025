import { Genre } from "../models/Genre";
import { useNetfluxContext } from "./ContextNetfluxProvider.tsx";
import { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance.ts";

interface GenreBoxProps {
    genre: Genre;
}

export default function GenreBox({ genre }: GenreBoxProps) {
    const { SelectedGenres, setSelectedGenres } = useNetfluxContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const fetchSelectedGenres = async () => {
            try {
                const response = await axiosInstance.get(`/criterias/giveGenres`, {
                    params: { userId: localStorage.getItem("user") },
                });

                const selectedGenres = response.data.map((g: Genre) => g.id);
                setSelectedGenres(selectedGenres);

                if (selectedGenres.includes(genre.id)) {
                    setIsSelected(true);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des genres sélectionnés :", error);
            }
        };

        fetchSelectedGenres();
    }, [genre.id, setSelectedGenres]);

    function toggleGenres() {
        if (isSelected) {
            setSelectedGenres(SelectedGenres.filter((id) => id !== genre.id));
            setIsSelected(false);
        } else {
            setSelectedGenres([...SelectedGenres, genre.id]);
            setIsSelected(true);
        }
    }

    return (
        <button className={`GenreBox ${isSelected ? "selected" : ""}`} onClick={toggleGenres}>
            {genre.name}
        </button>
    );
}
