//date : 06/10/2024

//import LoginPage from "./LoginPage.tsx";
//import NetfluxPage from "./NetfluxPage.tsx";
import {Router} from "../router/Router.tsx";
import {BrowserRouter} from "react-router-dom";
import {ContextNetfluxProvider} from "./ContextNetfluxProvider.tsx";


function App() {

  return (
      <ContextNetfluxProvider>
          <BrowserRouter>
              <Router/>
          </BrowserRouter>
      </ContextNetfluxProvider>
  )
}

export default App
