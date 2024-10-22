//date : 07/10/2024

import LoginButton from "./LoginButton.tsx";
import "../Ressources/Styles/StylesMenu.scss";
import {useNavigate} from "react-router";

export default function Menu(){
    const CurrentPage = window.location.pathname;
    const navigate = useNavigate();


    const goToNetflux = () => {
        console.log("Dans fonction goToNetflux")
        if(!CheckRedirection("/netflux")){
            console.log("Move to /netflux")
            navigate('/netflux');
        }
    }

    const goToComptes = () => {
        console.log("Dans fonction goToComptes")
        if(!CheckRedirection("/comptes")){
            console.log("Move to /comptes")
            navigate('/comptes');
        }
    }

    const goToFavoris = () => {
        console.log("Dans fonction goToFavoris")
        if(!CheckRedirection("/favoris")){
            console.log("Move to /favoris")
            navigate('/favoris');
        }
    }

    const goToCriteres = () => {
        console.log("Dans fonction goToCriteres")
        if(!CheckRedirection("/criteres")){
            console.log("Move to /criteres")
            navigate('/criteres');
        }
    }

    function CheckRedirection(page: string) {
        if (CurrentPage === page) {
            return true;
        } else {
            return false;
            }
    }

    return (
    <>
        <div className="menu">
        <nav>
            <ul>
                <li><a onClick={goToNetflux}>Principal</a></li>
                <li><a onClick={goToComptes}>Comptes</a></li>
                <li><a onClick={goToFavoris}>Favoris</a></li>
                <li><a onClick={goToCriteres}>Critères</a></li>
                <li><a><LoginButton></LoginButton></a></li>
            </ul>
        </nav>
        </div>
    </>
    )
}