import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/apiConfig';

// context register
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // cek session setiap membuka web
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/auth/check-session/`, {
                    withCredentials: true 
                });
                if (res.data.isAuthenticated) {
                    setUser(res.data.user); // Simpan data (id, username, peran, email)
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // fungsi login
    const login = (userData) => {
        setUser(userData);
    };

    //fungsi logout
    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/logout-${user?.peran || 'user'}/`, {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error("Logout gagal di backend:", err);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
            window.location.href = "/";
        }
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children} {/* Jangan render halaman sebelum tau user login/tidak */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);