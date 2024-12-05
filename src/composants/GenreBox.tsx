import { Genre } from "../models/Genre";

interface GenreBoxProps {
    genre: Genre;
}

export default function GenreBox({ genre }: GenreBoxProps) {
    return (
        <button className="GenreBox">
            {genre.name}
        </button>
    );
}
