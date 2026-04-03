import { Navigate } from "react-router-dom";

const AuthGuard = ({ children, role }) => {
    const hasToken = !!sessionStorage.getItem("accessToken");
    const userRole = sessionStorage.getItem("userRole");

    if (!hasToken) {
        return <Navigate to={role === "teacher" ? "/teacher_login" : "/"} replace />;
    }

    if (role === "teacher" && !userRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthGuard;
