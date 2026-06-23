import { useEffect, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { authAPI } from "@/services/authAPI";

export default function Header() {
    const [name, setName] = useState("Triza Nabila");
    const [role, setRole] = useState("member");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { session } = await authAPI.getSession();
                if (session && session.user && session.user.profile) {
                    setName(session.user.profile.name || session.user.email);
                    setRole(session.user.profile.role || "member");
                }
            } catch (err) {
                console.error("Error loading header profile:", err);
            }
        };
        loadProfile();
    }, []);

    return (
        <div className="flex justify-between items-center p-6 bg-transparent">
            <div className="relative w-full max-w-lg">
                <input
                    className="border-none p-3 pr-10 bg-white w-full rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-hijau transition-all"
                    type="text"
                    placeholder="Search Here..."
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>

            <div className="flex items-center space-x-4">
                {/* Lonceng dengan Animasi Ping */}
                <div className="relative p-3 bg-blue-100 rounded-2xl text-blue-500 cursor-pointer">
                    <FaBell />
                    <span className="absolute top-2 right-2 h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
                    </span>
                </div>
                
                <div className="p-3 bg-blue-100 rounded-2xl cursor-pointer text-blue-500"><FcAreaChart /></div>
                <div className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer"><SlSettings /></div>

                <div className="flex items-center space-x-4 border-l pl-4 border-gray-300">
                    <span className="text-sm">
                        Hello, <b>{name}</b> <span className="text-xs text-gray-400 font-normal">({role})</span>
                    </span>
                    <img src="/img/foto.png" className="w-10 h-10 rounded-full" alt="profile" />
                </div>
            </div>
        </div>
    );
}