import {useContext} from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const auth = useContext(AuthContext);

    if (!auth?.isAuthenticated) {
        console.log("ProtectedRoute: user not authenticated");
        console.log(auth);
        return <Navigate to="/login" />;
    }

    return children;
}
