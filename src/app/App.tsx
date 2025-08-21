// date : 06/10/2024

import { BrowserRouter } from "react-router-dom";
import { Router } from "../router/Router";
import { AuthProvider } from "../context/AuthContext";
import { ContextNetfluxProvider } from "../context/NetfluxContextProvider.tsx";

/**
 * Ordre des providers :
 * - ContextNetfluxProvider tout en haut (état global genres/providers/groupId)
 * - BrowserRouter (navigateur)
 * - AuthProvider (utilise useNavigate -> doit être sous BrowserRouter)
 */
function App() {
    return (
        <ContextNetfluxProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Router />
                </AuthProvider>
            </BrowserRouter>
        </ContextNetfluxProvider>
    );
}

export default App;
