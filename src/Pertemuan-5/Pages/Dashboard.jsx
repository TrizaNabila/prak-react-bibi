import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
    return (
        <div id="dashboard-container">
            <PageHeader />
            
            <div id="dashboard-grid" className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Total Orders */}
                <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6">
                    <div id="orders-icon" className="bg-hijau rounded-full p-4 text-3xl text-white">
                        <FaShoppingCart />
                    </div>
                    <div id="orders-info" className="flex flex-col">
                        <span id="orders-count" className="text-3xl font-bold text-gray-800">75</span>
                        <span id="orders-text" className="text-gray-400 text-sm">Total Orders</span>
                    </div>
                </div>

                {/* Total Delivered */}
                <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6">
                    <div id="delivered-icon" className="bg-biru rounded-full p-4 text-3xl text-white">
                        <FaTruck />
                    </div>
                    <div id="delivered-info" className="flex flex-col">
                        <span id="delivered-count" className="text-3xl font-bold text-gray-800">175</span>
                        <span id="delivered-text" className="text-gray-400 text-sm">Total Delivered</span>
                    </div>
                </div>

                {/* Total Canceled */}
                <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6">
                    <div id="canceled-icon" className="bg-merah rounded-full p-4 text-3xl text-white">
                        <FaBan />
                    </div>
                    <div id="canceled-info" className="flex flex-col">
                        <span id="canceled-count" className="text-3xl font-bold text-gray-800">40</span>
                        <span id="canceled-text" className="text-gray-400 text-sm">Total Canceled</span>
                    </div>
                </div>

                {/* Total Revenue */}
                <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6">
                    <div id="revenue-icon" className="bg-kuning rounded-full p-4 text-3xl text-white">
                        <FaDollarSign />
                    </div>
                    <div id="revenue-info" className="flex flex-col">
                        <span id="revenue-amount" className="text-3xl font-bold text-gray-800">Rp.128</span>
                        <span id="revenue-text" className="text-gray-400 text-sm">Total Revenue</span>
                    </div>
                </div>
            </div>

            <div className="p-4 mt-2">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Recent Orders</h3>
                        <button className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 hover:text-white transition-all">
                            View All Orders
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-gray-50">
                                    <th className="pb-4 font-bold">Customer Name</th>
                                    <th className="pb-4 font-bold">Order ID</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-gray-700">Nasi Goreng Gila Jakarta</td>
                                    <td className="py-4 text-gray-500 font-mono text-xs">#SEDAP-2026-001</td>
                                    <td className="py-4">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black italic">ON DELIVERY</span>
                                    </td>
                                    <td className="py-4 text-right font-black text-gray-800 underline decoration-green-400">Rp. 25.000</td>
                                </tr>
                                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-bold text-gray-700">Sate Ayam Madura</td>
                                    <td className="py-4 text-gray-500 font-mono text-xs">#SEDAP-2026-002</td>
                                    <td className="py-4">
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black italic">PENDING</span>
                                    </td>
                                    <td className="py-4 text-right font-black text-gray-800 underline decoration-yellow-400">Rp. 30.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* --- AKHIR IMPROVISASI 1 --- */}
        </div>
    );
}