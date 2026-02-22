// src/admin/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { FaUser, FaUsers, FaTicketAlt } from 'react-icons/fa';

const StatCard = ({ title, value, icon: Icon, iconClass, bgClass }) => {
    return (
        <div 
            className={`p-5 rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.02] ${bgClass} border border-gray-200`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-700">{title}</p>
                    <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
                </div>
                <div 
                    className={`p-3 rounded-xl ${iconClass}`} 
                    style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
                >
                    <Icon className="text-3xl" />
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAgents, setTotalAgents] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Tambahkan credentials: "include" agar cookie session terkirim
                const [usersRes, agentsRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/api/accounts/users/", { credentials: "include" }),
                    fetch("http://127.0.0.1:8000/api/accounts/agents/", { credentials: "include" }),
                ]);

                if (!usersRes.ok || !agentsRes.ok) throw new Error("Gagal mengambil data");

                const usersData = await usersRes.json();
                const agentsData = await agentsRes.json();

                setTotalUsers(usersData.length || 0);
                setTotalAgents(agentsData.length || 0);
            } catch (error) {
                console.error("Gagal memuat data dashboard:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const dashboardStats = [
        { 
            title: "Total User Daftar", 
            value: totalUsers, 
            icon: FaUser, 
            iconClass: "text-orange-500", 
            bgClass: "bg-orange-500/10" 
        },
        { 
            title: "Total Agent", 
            value: totalAgents, 
            icon: FaUsers, 
            iconClass: "text-purple-600", 
            bgClass: "bg-purple-600/10" 
        },
        { 
            title: "Tiket Terjual", 
            value: "0", 
            icon: FaTicketAlt, 
            iconClass: "text-blue-500", 
            bgClass: "bg-blue-500/10" 
        },
        { 
            title: "Total Penumpang", 
            value: "0", 
            icon: FaUsers, 
            iconClass: "text-purple-600", 
            bgClass: "bg-purple-600/10" 
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6"> 
                    <section className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Dashboard Administrasi</h2>
                        <p className="mb-6 text-gray-600">Ringkasan status terkini sistem Surya Kencana.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dashboardStats.map((stat, index) => (
                                <div key={index} className={index === 3 ? 'lg:col-start-1' : ''}>
                                    <StatCard {...stat} />
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
