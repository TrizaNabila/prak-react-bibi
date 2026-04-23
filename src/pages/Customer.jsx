import PageHeader from "../components/PageHeader";
import { customers } from "../data/customers";

export default function Customers() {
    return (
        <div id="dashboard-container" className="p-6">

            {/* HEADER */}
            <PageHeader title="Customers" breadcrumb={["Home", "Customers"]}>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
                    + Add Customer
                </button>
            </PageHeader>

            {/* TABLE CLEAN */}
            <div className="mt-6 bg-white rounded-2xl shadow p-6">
                <table className="w-full">

                    {/* HEADER */}
                    <thead>
                        <tr className="text-gray-400 text-sm">
                            <th className="text-left pb-4">Customer ID</th>
                            <th className="text-left pb-4">Customer Name</th>
                            <th className="text-left pb-4">Email</th>
                            <th className="text-left pb-4">Phone</th>
                            <th className="text-left pb-4">Loyalty</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {customers.map((item) => (
                            <tr key={item.id} className="text-sm">

                                {/* ID */}
                                <td className="py-3 text-green-500 font-semibold">
                                    {item.id}
                                </td>

                                {/* NAME */}
                                <td className="py-3 flex items-center gap-2">
                                    <span className="text-purple-500">👤</span>
                                    <span className="font-medium">{item.name}</span>
                                </td>

                                {/* EMAIL */}
                                <td className="py-3 text-gray-600">
                                    {item.email}
                                </td>

                                {/* PHONE */}
                                <td className="py-3 text-gray-600">
                                    {item.phone}
                                </td>

                                {/* LOYALTY */}
                                <td className="py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            item.loyalty === "Gold"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : item.loyalty === "Silver"
                                                ? "bg-gray-200 text-gray-600"
                                                : "bg-orange-100 text-orange-600"
                                        }`}
                                    >
                                        {item.loyalty}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}