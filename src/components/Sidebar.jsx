import { useEffect, useState } from "react";
import { LuLayoutDashboard, LuListOrdered, LuUsers, LuPlus, LuPackage, LuNetwork, LuFileText } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import { authAPI } from "@/services/authAPI";

export default function Sidebar() {
    const [role, setRole] = useState("member");
    const [name, setName] = useState("Guest");
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { session } = await authAPI.getSession();
                if (session && session.user && session.user.profile) {
                    setRole(session.user.profile.role || "member");
                    setName(session.user.profile.name || "Member");
                }
            } catch (err) {
                console.error("Error loading sidebar profile:", err);
            }
        };
        loadProfile();
    }, []);

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2
        ${isActive ? 
            "text-hijau bg-green-200 font-extrabold" : 
            "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`

    const handleLogout = async () => {
        try {
            await authAPI.signOut();
            navigate("/login");
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };
        
    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            
            {/* Logo */}
            <div id="sidebar-logo" className="flex flex-col">
                <span id="logo-title" className="font-poppins text-[48px] text-gray-900 leading-tight">
                    Sedap <b id="logo-dot" className="text-hijau">.</b>
                </span>
                <span id="logo-subtitle" className="font-semibold text-gray-400">
                    {role === "admin" ? "Modern Admin Dashboard" : "Member Portal"}
                </span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="mt-10">
                <ul id="menu-list" className="space-y-3">
                    
                    <li>
                        <NavLink id="menu-1" to="/" className={menuClass}>
                            <LuLayoutDashboard className="mr-4 text-xl" /> Dashboard
                        </NavLink>
                    </li>

                    {role === "admin" && (
                        <>
                            <li>
                                <NavLink id="menu-2" to="/orders" className={menuClass}>
                                    <LuListOrdered className="mr-4 text-xl" /> Orders
                                </NavLink>
                            </li>

                            <li>
                                <NavLink id="menu-3" to="/customers" className={menuClass}>
                                    <LuUsers className="mr-4 text-xl" /> Customers
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* MENU PRODUCTS */}
                    <li>
                        <NavLink id="menu-4" to="/products" className={menuClass}>
                            <LuPackage className="mr-4 text-xl" /> Products
                        </NavLink>
                    </li>

                    <li>
                        <NavLink id="menu-fitur-xyz" to="/fitur-xyz" className={menuClass}>
                            <LuNetwork className="mr-4 text-xl" /> Fitur Xyz
                        </NavLink>
                    </li>

                    {role === "admin" && (
                        <li>
                            <NavLink id="menu-users" to="/users" className={menuClass}>
                                <LuUsers className="mr-4 text-xl" /> Users
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink id="menu-notes" to="/notes" className={menuClass}>
                            <LuFileText className="mr-4 text-xl" /> Notes
                        </NavLink>
                    </li>

                    <hr className="my-4 border-gray-100" />
                    
                    <li>
                        <button 
                            onClick={handleLogout} 
                            className="w-full flex cursor-pointer items-center rounded-xl p-4 space-x-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                            <span className="mr-4">🚪</span> Logout
                        </button>
                    </li>

                </ul>
            </div>

            {/* bagian bawah tetap */}
            <div className="mt-10 mb-5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-[10px] font-bold mb-2">
                    <span className="text-gray-400 uppercase tracking-widest">Daily Sales Target</span>
                    <span className="text-hijau">75%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-hijau h-full w-[75%] transition-all duration-1000 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                </div>
            </div>

            <div id="sidebar-footer" className="mt-auto">
                <div id="footer-card" className="bg-hijau px-4 py-6 rounded-3xl shadow-lg mb-10 flex items-center relative overflow-hidden">
                    <div id="footer-text" className="text-white text-sm z-10 w-2/3">
                        <p className="mb-3 leading-tight">{role === "admin" ? "Hello Admin!" : "Order and get tier discount!"}</p>
                    </div>

                    <img 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/50 ml-auto shadow-md" 
                        src="/img/foto.png" 
                        alt="avatar" 
                    />
                </div>
                
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm italic">
                        Sedap Restaurant Dashboard
                    </span>
                    <p className="font-light text-gray-400 text-[10px] tracking-wide">
                        © 2026 All Right Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}