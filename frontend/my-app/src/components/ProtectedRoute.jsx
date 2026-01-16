import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // Parse user object
    let user = null;
    try {
        if (userStr) {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Error parsing user data", e);
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && user) {
        if (!allowedRoles.includes(user.role)) {
            // Redirect to home if role doesn't match
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
