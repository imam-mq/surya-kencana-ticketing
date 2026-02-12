import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBus, FaSun } from "react-icons/fa";
import SubmitButton from "../../components/ui/SubmitButton";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    //State Loading UI
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/accounts/get-csrf/", {
            credentials: "include",
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        //Loading Mulain
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/accounts/login-user/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        });

            const data = await response.json();

            if (response.ok && data.success) {
            alert("Login berhasil!");
            
            // ✅ Simpan user lengkap (id, username, email) ke localStorage
            const userData = {
                id: data.id,              // <- pastikan backend kirim ini
                username: data.username,  // dari Django response
                email: data.email || "",  // opsional, kalau backend kirim
            };

            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/user/profil"); // arahkan ke halaman profil
            } else {
            setError(data.message || "Login gagal");
            }
        } catch (error) {
            setError("Terjadi kesalahan koneksi ke server");
        }
    };


    const primaryColor = '#314D9C';
    const cardColor = '#D4C8A6';

    return (
        <div 
            className="min-h-screen flex items-center justify-center font-poppins"
            style={{ background: 'linear-gradient(135deg, #A8B4D4 0%, #314D9C 100%)' }}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm m-4 border-t-8 border-b-8"
                style={{ borderColor: cardColor }}
            >
                <div 
                    className="p-4 rounded-t-lg mb-6 flex items-center justify-center"
                    style={{ backgroundColor: cardColor }}
                >
                    <FaBus className="text-3xl mr-2" style={{ color: primaryColor }} />
                    <FaSun className="text-xl" style={{ color: primaryColor }} />
                    <span className="text-xl font-bold ml-1" style={{ color: primaryColor }}>
                        Surya Kencana
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <SubmitButton isLoading={isLoading}>
                        Masuk
                    </SubmitButton>
                </form>

                <div className="flex justify-between text-sm mt-4">
                    <Link to="/register" className="text-gray-600 hover:underline">
                        Registrasi
                    </Link>
                    <Link to="#" className="text-gray-600 hover:underline">
                        Lupa Password
                    </Link>
                </div>
            </div>
        </div>
    );
}
