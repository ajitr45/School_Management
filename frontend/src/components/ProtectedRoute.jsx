import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

    const accessToken = localStorage.getItem("access");
    const user = JSON.parse(localStorage.getItem("user"));

    // Login nahi hai
    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    // Role allowed nahi hai
    if (user?.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;