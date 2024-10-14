//date : 07/10/2024

import LoginButton from "./LoginButton";
import "../Ressources/Styles/StyleNetflux.scss";
import {useNavigate} from "react-router";

export default function Menu(){
    const navigate = useNavigate();
    const goToNetflux = () => { navigate('/login');
    console.log("Dans fonction goToNetflux")}
    const goToComptes = () => { navigate('/comptes') }
    const goToFavoris = () => { navigate('/favoris') }
    const goToCriteres = () => { navigate('/criteres') }

    return <nav>
        <ul>
            <li><a onClick={goToNetflux} >Principal</a></li>
            <li><a onClick={goToComptes} >Comptes</a></li>
            <li><a onClick={goToFavoris} >Favoris</a></li>
            <li><a onClick={goToCriteres} >Critères</a></li>
            <li><a ><LoginButton></LoginButton></a></li>
        </ul>
    </nav>;
}