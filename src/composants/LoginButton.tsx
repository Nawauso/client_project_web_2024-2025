//date : 06/10/2024

import {useNavigate} from "react-router";

export default function LoginButton() {
    const navigate = useNavigate();

    function getCurrentPage() {
        const CurrentPage = window.location.pathname;
        console.log("Dans fonction getCurrentPage")
        return CurrentPage;
    }

    const ListPages = ["/netflux", "/login", "/comptes", "/favoris", "/criteres"];

    const CheckLog = () => {
        console.log("Dans fonction CheckLog")
        const CurrentPage = getCurrentPage();
        if(ListPages.includes(CurrentPage)) {
            if(CurrentPage === "/login") {
                navigate('/netflux');
            } else {
                navigate('/login');
            }
        }
    }

    return (
        <button onClick={CheckLog}>Connexion</button>
    )
}