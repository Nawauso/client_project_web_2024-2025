import {Routes, Route} from 'react-router-dom';
import LoginPage from "../pages/LoginPage.tsx";
import NetfluxPage from "../pages/HomePage.tsx";
import {SignPage} from "../pages/RegisterPage.tsx";
import AccountPage from "../pages/AccountPage.tsx";
import FavoritePage from "../pages/FavoritesPage.tsx";
import CriteriaPage from "../pages/CriteriaPage.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.tsx";
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