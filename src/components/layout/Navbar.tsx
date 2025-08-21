//date : 07/10/2024

import "../../assets/styles/Styles/StylesMenu.scss";
import {useNavigate} from "react-router";
import {AuthContext} from "../../context/AuthContext.tsx";
import {useContext} from "react";

export default function Menu(){
    const CurrentPage = window.location.pathname;
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

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

    const goToLogin = () => {
        console.log("Dans fonction goToLogin")
        if(!CheckRedirection("/login")){
            console.log("Move to /login")
            auth?.logout();
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
                <li><a onClick={goToLogin}>Déconnexion</a></li>
            </ul>
        </nav>
        </div>
    </>
    )
}
