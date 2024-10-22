import {Routes, Route} from 'react-router-dom';
import LoginPage from "../composants/LoginPage.tsx";
import NetfluxPage from "../composants/NetfluxPage.tsx";
import Menu from "../composants/Menu.tsx";
export function Router() {

    return <Routes>
        <Route path="/netflux" element={<NetfluxPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path={"/comptes"} element={<Menu/>}/>
        <Route path={"/favoris"} element={<Menu/>}/>
        <Route path={"/criteres"} element={<Menu/>}/>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="*" element={<div>404</div>}/>
    </Routes>
}