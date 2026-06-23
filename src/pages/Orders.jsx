import { useEffect, useState } from "react";
import { FaDollarSign, FaFileInvoiceDollar } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { ordersAPI } from "@/services/ordersAPI";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertBox from "@/components/AlertBox";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await ordersAPI.fetchOrders();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setLoading(true);
            await ordersAPI.updateOrderStatus(orderId, newStatus);
            setSuccess(`Order status updated to ${newStatus}`);
            await loadOrders();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Failed to update order status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="dashboard-container" className="p-6">
            {/* HEADER */}
            <PageHeader title="Orders" breadcrumb={["Home", "Orders"]} />

            {success && <AlertBox type="success">{success}</AlertBox>}
            {error && <AlertBox type="error">{error}</AlertBox>}

            {/* TABLE STYLE CLEAN */}
            <div className="mt-6 bg-white rounded-2xl shadow p-6">
                {loading && orders.length === 0 ? (
                    <LoadingSpinner text="Memuat data pesanan..." />
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        Belum ada pesanan masuk.
                    </div>
                ) : (
                    <table className="w-full">
                        {/* HEADER */}
                        <thead>
                            <tr className="text-gray-400 text-sm border-b border-gray-100">
                                <th className="text-left pb-4">Order ID</th>
                                <th className="text-left pb-4">Customer Name</th>
                                <th className="text-left pb-4">Status</th>
                                <th className="text-left pb-4">Billing</th>
                                <th className="text-left pb-4">Points</th>
                                <th className="text-left pb-4">Order Date</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {orders.map((item) => {
                                const customerName = item.profiles?.name || item.profiles?.email || "Unknown";
                                return (
                                    <tr key={item.id} className="text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                        {/* ID */}
                                        <td className="py-4 text-green-500 font-semibold max-w-[120px] truncate" title={item.id}>
                                            {item.id.substring(0, 8)}...
                                        </td>

                                        {/* CUSTOMER */}
                                        <td className="py-4 flex items-center gap-2">
                                            <span className="text-purple-500">👤</span>
                                            {customerName}
                                        </td>

                                        {/* STATUS */}
                                        <td className="py-4">
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${
                                                    item.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : item.status === "Delivered"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                <option value="Pending" className="bg-white text-yellow-600">Pending</option>
                                                <option value="Delivered" className="bg-white text-green-600">Delivered</option>
                                                <option value="Canceled" className="bg-white text-red-600">Canceled</option>
                                            </select>
                                        </td>

                                        {/* BILLING */}
                                        <td className="py-4 text-gray-700">
                                            <div className="flex flex-col text-xs">
                                                <span className="text-gray-400">Total: Rp {item.total_amount?.toLocaleString("id-ID")}</span>
                                                {item.discount_amount > 0 && (
                                                    <span className="text-red-400">- Disc: Rp {item.discount_amount?.toLocaleString("id-ID")}</span>
                                                )}
                                                <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                                                    <FaDollarSign className="text-blue-500 text-[10px]" /> 
                                                    Rp {item.final_amount?.toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </td>

                                        {/* POINTS EARNED */}
                                        <td className="py-4 font-semibold text-gray-600 text-xs">
                                            +{item.points_earned || 0} pts
                                        </td>

                                        {/* DATE */}
                                        <td className="py-4 text-gray-400 text-xs">
                                            📅 {item.order_date ? new Date(item.order_date).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            }) : "-"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}