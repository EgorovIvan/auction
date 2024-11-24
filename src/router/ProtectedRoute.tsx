import * as React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from "../stores/AuthStore.ts";

const ProtectedRoute: React.FC = () => {

    const { isLoggedIn } = useAuthStore();

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;

};

export default ProtectedRoute;
