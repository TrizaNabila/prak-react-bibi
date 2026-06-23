import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { usersAPI } from "@/services/usersAPI";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertBox from "@/components/AlertBox";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoading(true);
                const allUsers = await usersAPI.fetchUsers();
                // Filter users to only show members/customers
                const memberList = allUsers.filter(user => user.role === "member");
                setCustomers(memberList);
            } catch (err) {
                console.error("Error loading customers:", err);
                setError(err.message || "Failed to load customers data.");
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    return (
        <div id="dashboard-container" className="p-6">
            {/* HEADER */}
            <PageHeader title="Customers" breadcrumb={["Home", "Customers"]} />

            {error && <AlertBox type="error">{error}</AlertBox>}

            {/* TABLE CLEAN */}
            <div className="mt-6 bg-white rounded-2xl shadow p-6">
                {loading ? (
                    <LoadingSpinner text="Membuat data pelanggan..." />
                ) : customers.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        Belum ada data pelanggan terdaftar.
                    </div>
                ) : (
                    <table className="w-full">
                        {/* HEADER */}
                        <thead>
                            <tr className="text-gray-400 text-sm">
                                <th className="text-left pb-4">Customer ID</th>
                                <th className="text-left pb-4">Customer Name</th>
                                <th className="text-left pb-4">Email</th>
                                <th className="text-left pb-4">Phone</th>
                                <th className="text-left pb-4">Points</th>
                                <th className="text-left pb-4">Loyalty Tier</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {customers.map((item) => (
                                <tr key={item.id} className="text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    {/* ID */}
                                    <td className="py-4 text-green-500 font-semibold max-w-[150px] truncate" title={item.id}>
                                        {item.id.substring(0, 8)}...
                                    </td>

                                    {/* NAME */}
                                    <td className="py-4 flex items-center gap-2">
                                        <span className="text-purple-500 text-lg">👤</span>
                                        <span className="font-medium text-gray-800">{item.name || "No Name"}</span>
                                    </td>

                                    {/* EMAIL */}
                                    <td className="py-4 text-gray-600">
                                        {item.email}
                                    </td>

                                    {/* PHONE */}
                                    <td className="py-4 text-gray-600">
                                        {item.phone || "-"}
                                    </td>

                                    {/* POINTS */}
                                    <td className="py-4 font-bold text-gray-700">
                                        {item.points || 0} pts
                                    </td>

                                    {/* LOYALTY */}
                                    <td className="py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                                item.tier === "gold"
                                                    ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                                                    : item.tier === "silver"
                                                    ? "bg-gray-100 text-gray-600 border border-gray-200"
                                                    : item.tier === "platinum"
                                                    ? "bg-purple-100 text-purple-600 border border-purple-200"
                                                    : "bg-orange-100 text-orange-600 border border-orange-200"
                                            }`}
                                        >
                                            {item.tier || "bronze"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}