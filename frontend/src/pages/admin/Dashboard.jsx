import React, { useEffect, useState } from 'react';
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { FaUser, FaUsers, FaTicketAlt, FaTag } from 'react-icons/fa';
import { getAdminUsers, getAdminAgents } from "../../api/adminApi";

const accentColors = {
    orange: {
        bar: 'bg-gradient-to-r from-orange-500 to-orange-400',
        iconWrap: 'bg-orange-50',
        icon: 'text-orange-500',
        dot: 'bg-emerald-400',
    },
    purple: {
        bar: 'bg-gradient-to-r from-purple-600 to-purple-400',
        iconWrap: 'bg-purple-50',
        icon: 'text-purple-600',
        dot: 'bg-emerald-400',
    },
    amber: {
        bar: 'bg-gradient-to-r from-amber-600 to-amber-400',
        iconWrap: 'bg-amber-50',
        icon: 'text-amber-600',
        dot: 'bg-amber-400',
    },
    green: {
        bar: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
        iconWrap: 'bg-emerald-50',
        icon: 'text-emerald-600',
        dot: 'bg-emerald-400',
    },
};

const StatCard = ({ title, value, icon: Icon, color, footer }) => {
    const c = accentColors[color];
    return (
        <div className="relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Top accent bar */}
            <div className={`h-[3px] w-full ${c.bar}`} />
            <div className="p-5">
                {/* Icon */}
                <div className={`absolute top-6 right-5 w-10 h-10 rounded-xl ${c.iconWrap} flex items-center justify-center`}>
                    <Icon className={`text-lg ${c.icon}`} />
                </div>
                {/* Label */}
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                {/* Value */}
                <p className="text-4xl font-bold text-gray-900 mb-3 leading-none">{value}</p>
                {/* Footer */}
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    <span className="text-[11px] text-gray-400">{footer}</span>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAgents, setTotalAgents] = useState(0);
    const [totalSetoranPending] = useState(0);
    const [totalPromoAktif] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersData, agentsData] = await Promise.all([
                    getAdminUsers(),
                    getAdminAgents(),
                ]);
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
            title: "Total User",
            value: totalUsers,
            icon: FaUser,
            color: "orange",
            footer: "Total User Daftar",
        },
        {
            title: "Total Agen",
            value: totalAgents,
            icon: FaUsers,
            color: "purple",
            footer: "Total Agent Daftar",
        },
        {
            title: "Setoran Pending",
            value: totalSetoranPending,
            icon: FaTicketAlt,
            color: "amber",
            footer: "Menunggu verifikasi",
        },
        {
            title: "Promo Aktif",
            value: totalPromoAktif,
            icon: FaTag,
            color: "green",
            footer: "Sedang berjalan",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Administrasi</h2>
                        <p className="mb-6 text-sm text-gray-500">Ringkasan status terkini sistem Surya Kencana.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {dashboardStats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;