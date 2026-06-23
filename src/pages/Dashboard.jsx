import { useEffect, useState } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaCrown, FaGift, FaHistory } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { authAPI } from "@/services/authAPI";
import { ordersAPI } from "@/services/ordersAPI";
import { productsAPI } from "@/services/productsAPI";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertBox from "@/components/AlertBox";

export default function Dashboard() {
    const [role, setRole] = useState("member");
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Admin dashboard metrics
    const [metrics, setMetrics] = useState({
        totalOrders: 0,
        totalDelivered: 0,
        totalCanceled: 0,
        totalRevenue: 0
    });

    // Member dashboard states
    const [products, setProducts] = useState([]);
    const [memberOrders, setMemberOrders] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError("");
            
            // 1. Get current session
            const { session } = await authAPI.getSession();
            if (!session || !session.user) {
                setError("No active session found.");
                return;
            }
            
            const profile = session.user.profile || { role: "member", tier: "bronze", points: 0 };
            setUserProfile(profile);
            setRole(profile.role);

            if (profile.role === "admin") {
                // Fetch all orders to compute metrics
                const allOrders = await ordersAPI.fetchOrders();
                const total = allOrders.length;
                const delivered = allOrders.filter(x => x.status === "Delivered").length;
                const canceled = allOrders.filter(x => x.status === "Canceled").length;
                
                // Sum final_amount of Delivered orders for Revenue
                const revenue = allOrders
                    .filter(x => x.status === "Delivered")
                    .reduce((sum, ord) => sum + (parseFloat(ord.final_amount) || 0), 0);

                setMetrics({
                    totalOrders: total,
                    totalDelivered: delivered,
                    totalCanceled: canceled,
                    totalRevenue: revenue
                });
            } else {
                // Fetch member's own orders & active products list
                const [myOrders, activeProducts] = await Promise.all([
                    ordersAPI.fetchUserOrders(session.user.id),
                    productsAPI.fetchProducts()
                ]);
                setMemberOrders(myOrders);
                
                // Only show products in stock
                setProducts(activeProducts.filter(p => p.stock > 0));
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
            setError(err.message || "Failed to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Member Cart Actions
    const handleAddToCart = () => {
        if (!selectedProductId) return;
        const prod = products.find(x => x.id === parseInt(selectedProductId));
        if (!prod) return;

        if (orderQuantity > prod.stock) {
            setError(`Cannot add more than available stock (${prod.stock} pcs)`);
            return;
        }

        const existingIdx = cart.findIndex(x => x.product_id === prod.id);
        if (existingIdx !== -1) {
            const newQty = cart[existingIdx].quantity + orderQuantity;
            if (newQty > prod.stock) {
                setError(`Combined quantity exceeds available stock (${prod.stock} pcs)`);
                return;
            }
            const updatedCart = [...cart];
            updatedCart[existingIdx].quantity = newQty;
            setCart(updatedCart);
        } else {
            setCart([...cart, {
                product_id: prod.id,
                product_name: prod.tittle,
                price: prod.price,
                quantity: orderQuantity
            }]);
        }
        setError("");
    };

    const handleRemoveFromCart = (index) => {
        const updated = [...cart];
        updated.splice(index, 1);
        setCart(updated);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            setLoading(true);
            setError("");
            
            const { session } = await authAPI.getSession();
            await ordersAPI.createOrder(session.user.id, cart, userProfile);
            
            setSuccess("Order placed successfully! Points updated.");
            setCart([]);
            setSelectedProductId("");
            setOrderQuantity(1);
            
            // Reload stats and profile data
            await loadDashboardData();
            setTimeout(() => setSuccess(""), 4000);
        } catch (err) {
            console.error("Checkout failed:", err);
            setError(err.message || "Failed to complete transaction.");
        } finally {
            setLoading(false);
        }
    };

    // Helper: calculate cart totals
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let memberDiscountPercent = 5;
    if (userProfile?.tier === "silver") memberDiscountPercent = 10;
    else if (userProfile?.tier === "gold") memberDiscountPercent = 15;
    else if (userProfile?.tier === "platinum") memberDiscountPercent = 20;

    const cartDiscountAmount = cartSubtotal * (memberDiscountPercent / 100);
    const cartFinalPrice = cartSubtotal - cartDiscountAmount;
    const potentialPoints = Math.floor(cartFinalPrice / 10000);

    if (loading && !userProfile) {
        return <LoadingSpinner text="Memuat halaman dashboard..." />;
    }

    return (
        <div id="dashboard-container" className="p-6">
            <PageHeader title={role === "admin" ? "Admin Dashboard" : "Member Portal"} />

            {success && <AlertBox type="success">{success}</AlertBox>}
            {error && <AlertBox type="error">{error}</AlertBox>}

            {role === "admin" ? (
                /* ==================== ADMIN VIEW ==================== */
                <div id="dashboard-grid" className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Total Orders */}
                    <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div id="orders-icon" className="bg-hijau rounded-full p-4 text-3xl text-white">
                            <FaShoppingCart />
                        </div>
                        <div id="orders-info" className="flex flex-col">
                            <span id="orders-count" className="text-3xl font-bold text-gray-800">{metrics.totalOrders}</span>
                            <span id="orders-text" className="text-gray-400 text-sm">Total Orders</span>
                        </div>
                    </div>

                    {/* Total Delivered */}
                    <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div id="delivered-icon" className="bg-biru rounded-full p-4 text-3xl text-white">
                            <FaTruck />
                        </div>
                        <div id="delivered-info" className="flex flex-col">
                            <span id="delivered-count" className="text-3xl font-bold text-gray-800">{metrics.totalDelivered}</span>
                            <span id="delivered-text" className="text-gray-400 text-sm">Total Delivered</span>
                        </div>
                    </div>

                    {/* Total Canceled */}
                    <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div id="canceled-icon" className="bg-merah rounded-full p-4 text-3xl text-white">
                            <FaBan />
                        </div>
                        <div id="canceled-info" className="flex flex-col">
                            <span id="canceled-count" className="text-3xl font-bold text-gray-800">{metrics.totalCanceled}</span>
                            <span id="canceled-text" className="text-gray-400 text-sm">Total Canceled</span>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div id="revenue-icon" className="bg-kuning rounded-full p-4 text-3xl text-white">
                            <FaDollarSign />
                        </div>
                        <div id="revenue-info" className="flex flex-col">
                            <span id="revenue-amount" className="text-xl font-bold text-gray-800">
                                Rp {metrics.totalRevenue?.toLocaleString("id-ID")}
                            </span>
                            <span id="revenue-text" className="text-gray-400 text-sm">Total Revenue (Delivered)</span>
                        </div>
                    </div>
                </div>
            ) : (
                /* ==================== MEMBER VIEW ==================== */
                <div className="space-y-8">
                    {/* Member Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Points Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                            <div className="p-4 rounded-full bg-orange-100 text-orange-500 text-2xl">
                                <FaGift />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400">Total Reward Points</h4>
                                <p className="text-3xl font-black text-gray-800">{userProfile?.points || 0} pts</p>
                                <p className="text-xs text-gray-400 mt-1">Earn 1 pt per Rp 10.000 spent</p>
                            </div>
                        </div>

                        {/* Tier Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                            <div className="p-4 rounded-full bg-purple-100 text-purple-500 text-2xl">
                                <FaCrown />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400">Loyalty Status</h4>
                                <p className="text-3xl font-black text-gray-800 capitalize">{userProfile?.tier || "Bronze"}</p>
                                <p className="text-xs text-purple-600 font-medium mt-1">Active Discount: {memberDiscountPercent}% OFF</p>
                            </div>
                        </div>

                        {/* Discount reference card */}
                        <div className="bg-[#009262] text-white p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-sm mb-2 uppercase tracking-wide opacity-80">Tier Benefits</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Bronze: 5% Off</div>
                                <div>Silver (100+ pts): 10% Off</div>
                                <div>Gold (300+ pts): 15% Off</div>
                                <div>Platinum (1000+ pts): 20% Off</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Wizard (Shopping Form) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Product selection and Cart */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Order</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase">Select Product</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm bg-white"
                                    >
                                        <option value="">-- Choose Menu / Product --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.tittle} (Rp {p.price?.toLocaleString()} | Stock: {p.stock})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase">Quantity</label>
                                        <input
                                            type="number"
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-hijau text-sm"
                                            min="1"
                                        />
                                    </div>
                                    <div className="w-1/2 flex items-end">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className="w-full py-2 bg-hijau hover:bg-green-600 text-white rounded-xl font-bold text-sm shadow-sm transition-all"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>

                                {/* Cart Display */}
                                {cart.length > 0 && (
                                    <div className="mt-6 border-t pt-4">
                                        <h4 className="font-bold text-sm text-gray-800 mb-2">Cart Summary</h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                            {cart.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.product_name}</p>
                                                        <p className="text-gray-400">{item.quantity} x Rp {item.price?.toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFromCart(index)}
                                                        className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Checkout Summary */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Invoice Billing</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Items Cost:</span>
                                        <span className="font-semibold text-gray-800">Rp {cartSubtotal.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex justify-between text-red-500 font-medium">
                                        <span>Tier Discount ({memberDiscountPercent}%):</span>
                                        <span>- Rp {cartDiscountAmount.toLocaleString("id-ID")}</span>
                                    </div>
                                    <hr className="my-2 border-dashed" />
                                    <div className="flex justify-between text-lg font-black">
                                        <span className="text-gray-800">Amount Due:</span>
                                        <span className="text-hijau">Rp {cartFinalPrice.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                                {cart.length > 0 && (
                                    <div className="mt-4 bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center space-x-2 text-xs text-orange-600">
                                        <span>🎉</span>
                                        <span>You will earn <b>+{potentialPoints} points</b> from this purchase!</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || loading}
                                className="mt-6 w-full py-3 bg-[#009262] hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                            >
                                {loading ? "Processing Order..." : "Confirm & Checkout"}
                            </button>
                        </div>
                    </div>

                    {/* Member Order History */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <FaHistory className="text-hijau" />
                            <h3 className="text-lg font-bold text-gray-800">My Order History</h3>
                        </div>
                        {memberOrders.length === 0 ? (
                            <p className="text-center py-8 text-gray-400 text-sm">No orders placed yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs text-gray-400 uppercase border-b pb-2">
                                            <th className="py-2">Order ID</th>
                                            <th>Date</th>
                                            <th className="text-right">Total Price</th>
                                            <th className="text-right">Discount</th>
                                            <th className="text-right">Paid Amount</th>
                                            <th className="text-center">Points</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-xs text-gray-700 divide-y divide-gray-50">
                                        {memberOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 font-semibold text-green-500" title={order.id}>
                                                    {order.id.substring(0, 8)}...
                                                </td>
                                                <td>
                                                    {new Date(order.order_date).toLocaleDateString("id-ID", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </td>
                                                <td className="text-right">Rp {order.total_amount?.toLocaleString("id-ID")}</td>
                                                <td className="text-right text-red-500">- Rp {order.discount_amount?.toLocaleString("id-ID")}</td>
                                                <td className="text-right font-bold">Rp {order.final_amount?.toLocaleString("id-ID")}</td>
                                                <td className="text-center text-orange-500">+{order.points_earned}</td>
                                                <td className="text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                                                        order.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : order.status === "Delivered"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}