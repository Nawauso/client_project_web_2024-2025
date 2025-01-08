
import {Router} from "../router/Router.tsx";
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from "./AuthContext";


function App() {

  return (
          <BrowserRouter>
              <AuthProvider>
                <Router/>
              </AuthProvider>
          </BrowserRouter>
  )
}

export default App
