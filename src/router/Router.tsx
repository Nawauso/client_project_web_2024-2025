import {Routes, Route} from 'react-router-dom';
import LoginPage from "../composants/LoginPage.tsx";
import NetfluxPage from "../composants/NetfluxPage.tsx";
import {SignPage} from "../composants/SignPage.tsx";
import AccountPage from "../composants/AccountPage.tsx";
import FavoritePage from "../composants/FavoritePage.tsx";
import CriteriaPage from "../composants/CriteriaPage.tsx";
export function Router() {

    return <Routes>
        <Route path="/netflux" element={<NetfluxPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path={"/comptes"} element={<AccountPage/>}/>
        <Route path={"/favoris"} element={<FavoritePage/>}/>
        <Route path={"/criteres"} element={<CriteriaPage/>}/>
        <Route path={"/inscription"} element={<SignPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="*" element={<div>404</div>}/>
    </Routes>
}