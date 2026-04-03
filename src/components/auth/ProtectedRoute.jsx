import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-lg text-gray-600">
                Laden...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/dashboard/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;


