
import {useNavigate} from "react-router";
import React from "react";


export function SignButton(){

    const navigate = useNavigate();

    function goToSignPage(event: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        event.preventDefault();
        return navigate('/inscription');
    }



    return (
        <button onClick={goToSignPage} >Inscription</button>
    )
}