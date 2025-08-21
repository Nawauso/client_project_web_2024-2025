import { Genre } from "../models/Genre";

type GenreBoxProps = {
    genre: Genre;
    selected: boolean;
    onToggle: (id: number) => void;
};

export default function GenreBox({ genre, selected, onToggle }: GenreBoxProps) {
    return (
        <button
            className={`GenreBox ${selected ? "selected" : ""}`}
            onClick={() => onToggle(genre.id)}
            type="button"
        >
            {genre.name}
        </button>
    );
}
