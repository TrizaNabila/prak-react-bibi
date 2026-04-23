import { FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { orders } from "../data/orders";

export default function Orders() {
    return (
        <div id="dashboard-container" className="p-6">

            {/* HEADER */}
            <PageHeader title="Orders" breadcrumb={["Home", "Orders"]}>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
                    + Add Orders
                </button>
            </PageHeader>

            {/* TABLE STYLE CLEAN */}
            <div className="mt-6 bg-white rounded-2xl shadow p-6">
                <table className="w-full">

                    {/* HEADER */}
                    <thead>
                        <tr className="text-gray-400 text-sm">
                            <th className="text-left pb-4">Order ID</th>
                            <th className="text-left pb-4">Customer Name</th>
                            <th className="text-left pb-4">Status</th>
                            <th className="text-left pb-4">Total Price</th>
                            <th className="text-left pb-4">Order Date</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {orders.map((item) => (
                            <tr key={item.id} className="text-sm">

                                {/* ID */}
                                <td className="py-3 text-green-500 font-semibold">
                                    {item.id}
                                </td>

                                {/* CUSTOMER */}
                                <td className="py-3 flex items-center gap-2">
                                    <span className="text-purple-500">👤</span>
                                    {item.customerName}
                                </td>

                                {/* STATUS */}
                                <td className="py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            item.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : item.status === "Completed"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                {/* TOTAL */}
                                <td className="py-3 flex items-center gap-2 text-gray-600">
                                    <FaDollarSign className="text-blue-500" />
                                    Rp {item.totalPrice}
                                </td>

                                {/* DATE */}
                                <td className="py-3 text-gray-500">
                                    📅 {item.orderDate}
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}