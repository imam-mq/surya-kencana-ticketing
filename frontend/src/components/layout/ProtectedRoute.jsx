import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400 text-sm font-poppins">Mengecek otorisasi...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.peran)) {
        if (user.peran === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.peran === 'agent') return <Navigate to="/agent/dashboard" replace />;
        return <Navigate to="/user/profil" replace />; // Default balikan ke user
    }

    return <Outlet />;
};

export default ProtectedRoute;