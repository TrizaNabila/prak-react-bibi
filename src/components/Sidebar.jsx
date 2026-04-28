import { LuLayoutDashboard, LuListOrdered, LuUsers, LuPlus } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4  space-x-2
        ${isActive ? 
            "text-hijau bg-green-200 font-extrabold" : 
            "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`
        
    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            
            {/* Logo */}
            <div id="sidebar-logo" className="flex flex-col">
                <span id="logo-title" className="font-poppins text-[48px] text-gray-900 leading-tight">
                    Sedap <b id="logo-dot" className="text-hijau">.</b>
                </span>
                <span id="logo-subtitle" className="font-semibold text-gray-400">Modern Admin Dashboard</span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="mt-10">
                <ul id="menu-list" className="space-y-3">
                    
                    <li>
                        <NavLink id="menu-1" to="/" className={menuClass}>
                            <LuLayoutDashboard className="mr-4 text-xl" /> Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink id="menu-2" to="/Orders" className={menuClass}>
                            <LuListOrdered className="mr-4 text-xl" /> Orders
                        </NavLink>
                    </li>

                    <li>
                        <NavLink id="menu-3" to="/Customers" className={menuClass}>
                            <LuUsers className="mr-4 text-xl" /> Customers
                        </NavLink>
                    </li>

                    {/* 🔥 TAMBAHAN SESUAI TUGAS */}
                    <li>
                        <NavLink to="/error-400" className={menuClass}>
                            ⚠️ Error 400
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/error-401" className={menuClass}>
                            🔒 Error 401
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/error-403" className={menuClass}>
                            ⛔ Error 403
                        </NavLink>
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
                        <p className="mb-3 leading-tight">Please organize your menus through button below!</p>
                        <div id="add-menu-button" className="flex justify-center items-center p-2 bg-white rounded-md space-x-2 cursor-pointer active:scale-95 transition-transform shadow-sm">
                            <span className="text-gray-600 font-bold flex items-center text-xs">
                                <LuPlus className="mr-1" /> Add Menus
                            </span>
                        </div>
                    </div>

                    <img 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/50 ml-auto shadow-md" 
                        src="/img/foto.png" 
                        alt="avatar" 
                    />
                </div>
                
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800 text-sm italic">
                        Sedap Restaurant Admin Dashboard
                    </span>
                    <p className="font-light text-gray-400 text-[10px] tracking-wide">
                        © 2026 All Right Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}