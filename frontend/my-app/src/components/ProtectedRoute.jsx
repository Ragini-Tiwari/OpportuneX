import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isSignedIn, user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div className="min-h-screen flex items-center justify-center bg-black-950 text-white">Loading...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const userRole = user.publicMetadata?.role || "candidate"; // Default role
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
