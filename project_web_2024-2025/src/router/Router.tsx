import {Routes, Route} from 'react-router-dom';
import LoginPage from "../composants/LoginPage.tsx";
import NetfluxPage from "../composants/NetfluxPage.tsx";
import {HomePage} from "../composants/HomePage.tsx";
export function Router() {

    return <Routes>
        <Route path="/netflux" element={<NetfluxPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path={"/comptes"} element={<div>comptes</div>}/>
        <Route path={"/favoris"} element={<div>favoris</div>}/>
        <Route path={"/criteres"} element={<div>criteres</div>}/>
        <Route path="/" element={<HomePage/>}/>
        <Route path="*" element={<div>404</div>}/>
    </Routes>
}