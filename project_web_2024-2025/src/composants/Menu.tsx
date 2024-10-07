import LoginButton from "./LoginButton";
import "../Ressources/Styles/StyleNetflux.scss";

export default function Menu() {
return <nav>
        <ul>
            <li><a href="#">Principal</a></li>
            <li><a href="#">Comptes</a></li>
            <li><a href="#">Favoris</a></li>
            <li><a href="#">Critères</a></li>
            <li><a href="#"><LoginButton></LoginButton></a></li>
        </ul>
    </nav>;
}