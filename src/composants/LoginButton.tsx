//date : 06/10/2024

import {useNavigate} from "react-router";
import React from "react";

export default function LoginButton() {
    const navigate = useNavigate();

    function getCurrentPage() {
        const CurrentPage = window.location.pathname;
        console.log("Dans fonction getCurrentPage")
        return CurrentPage;
    }

    const ListPages = ["/netflux", "/comptes", "/favoris", "/criteres"];

    function Checklog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        console.log("Dans fonction CheckLog")
        const CurrentPage = getCurrentPage();
        if (!ListPages.includes(CurrentPage)) {
            navigate("/netflux");
        } else {
            navigate("/login");
        }
    }


    return (
        <button onClick={Checklog}>Connexion</button>
    )
}