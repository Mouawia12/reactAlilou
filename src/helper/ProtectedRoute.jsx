import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./Tools";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const location = useLocation();
    const auth = isAuthenticated();


    // 🚀 If authenticated and tries to go to /login or /register → redirect to /home
    if (auth && (location.pathname === "/login" || location.pathname === "/Register")) {
        return <Navigate to="/home" replace />;
    }

    // 🚀 If not authenticated and tries to access a protected route (not /login or /register) → redirect to /login
    if (!auth && location.pathname !== "/login" && location.pathname !== "/Register") {
        return <Navigate to="/login" replace />;
    }

    // 🚀 Otherwise render the page
    return <>{children}</>;
};

export default ProtectedRoute;
