import {ReactNode} from "react";


export function Ifconnected(props:{children: ReactNode}) {

    const islogged = true;

    return islogged ? (
        <div>
            {props.children}
        </div>
    ) : (
        <div>
            <h1>Vous n'êtes pas connecté</h1>
        </div>
    )
}