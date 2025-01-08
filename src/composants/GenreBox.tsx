import { Genre } from "../models/Genre";
import {useNetfluxContext} from "./ContextNetfluxProvider.tsx";
import {useEffect, useState} from "react";

interface GenreBoxProps {
    genre: Genre;
}

export default function GenreBox({ genre }: GenreBoxProps) {

    const {SelectedGenres, setSelectedGenres} = useNetfluxContext();
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        if (SelectedGenres.includes(genre.id)) {
            setIsSelected(true);
        }
    }, []);

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
        <button className={`GenreBox  ${isSelected ? "selected" : ""}`} onClick={toggleGenres}>
            {genre.name}
        </button>
    );
}
