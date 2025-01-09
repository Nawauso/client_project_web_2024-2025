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
                const response = await axiosInstance.get(`/criterias/give`, {
                    params: { userId: localStorage.getItem("user") }, // Récupérer userId depuis localStorage ou contexte
                });

                const selectedGenres = response.data.map((g: Genre) => g.id);

                // Vérifier si le genre actuel est dans les genres sélectionnés
                if (selectedGenres.includes(genre.id)) {
                    setIsSelected(true);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des genres sélectionnés :", error);
            }
        };

        fetchSelectedGenres();
    }, [genre.id]);

    function toggleGenres() {
        if (isSelected) {
            setSelectedGenres(SelectedGenres.filter((id) => id !== genre.id));
        } else {
            setSelectedGenres([...SelectedGenres, genre.id]);
        }
        setIsSelected(!isSelected);
    }

    return (
        <button className={`GenreBox ${isSelected ? "selected" : ""}`} onClick={toggleGenres}>
            {genre.name}
        </button>
    );
}
