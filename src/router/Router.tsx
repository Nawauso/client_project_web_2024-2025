import {Routes, Route} from 'react-router-dom';
import LoginPage from "../composants/LoginPage.tsx";
import NetfluxPage from "../composants/NetfluxPage.tsx";
import {SignPage} from "../composants/SignPage.tsx";
import AccountPage from "../composants/AccountPage.tsx";
import FavoritePage from "../composants/FavoritePage.tsx";
import CriteriaPage from "../composants/CriteriaPage.tsx";
import ProtectedRoute from "../composants/ProtectedRoute.tsx";
export function Router() {

    return <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/netflux" element={<ProtectedRoute><NetfluxPage/></ProtectedRoute>}/>
        <Route path={"/comptes"} element={<ProtectedRoute><AccountPage/></ProtectedRoute>}/>
        <Route path={"/favoris"} element={<ProtectedRoute><FavoritePage/></ProtectedRoute>}/>
        <Route path={"/criteres"} element={<ProtectedRoute><CriteriaPage/></ProtectedRoute>}/>
        <Route path={"/inscription"} element={<SignPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="*" element={<div>404</div>}/>
    </Routes>
}