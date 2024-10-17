
import {useNavigate} from "react-router";


export function SignButton(){

    const navigate = useNavigate();
    const goToSignPage = () => {
        return navigate('/inscription');
    }


    return (
        <button onClick={goToSignPage} >Inscription</button>
    )
}