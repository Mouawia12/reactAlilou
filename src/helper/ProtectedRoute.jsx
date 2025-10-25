import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./Tools";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const auth = isAuthenticated();

    if (!auth) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
