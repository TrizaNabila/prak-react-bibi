import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { productsAPI } from "@/services/productsAPI"
import LoadingSpinner from "@/components/LoadingSpinner"
import AlertBox from "@/components/AlertBox"

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true)
                const data = await productsAPI.fetchProductById(id)
                setProduct(data)
            } catch (err) {
                console.error("Error loading product detail:", err)
                setError(err.message || "Failed to load product detail.")
            } finally {
                setLoading(false)
            }
        }
        
        loadProduct()
    }, [id])

    if (loading) return <LoadingSpinner text="Memuat detail produk..." />
    if (error) return <AlertBox type="error">{error}</AlertBox>
    if (!product) return <div className="p-4 text-center">Produk tidak ditemukan.</div>

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">
            <img
                src={product.image || "https://dummyimage.com/300/009262/fff&text=Product"}
                alt={product.tittle}
                className="rounded-xl mb-4 w-full h-48 object-contain bg-gray-50 p-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{product.tittle}</h2>
            <p className="text-gray-600 mb-1">Code: <span className="font-semibold uppercase">{product.code}</span></p>
            <p className="text-gray-600 mb-1">Category: <span className="font-semibold uppercase">{product.category}</span></p>
            <p className="text-gray-600 mb-1">Brand: <span className="font-semibold">{product.brand || "Essence"}</span></p>
            <p className="text-gray-600 mb-4">Stock: <span className={`font-semibold ${product.stock < 10 ? 'text-red-500':'text-gray-700'}`}>{product.stock} pcs</span></p>
            <p className="text-gray-800 font-bold text-xl border-t pt-4">
                Price: Rp {product.price?.toLocaleString("id-ID") || "0"}
            </p>
            
            <Link 
                to="/products"
                className="mt-6 block text-center py-2.5 bg-hijau hover:bg-green-600 text-white font-bold rounded-xl shadow-sm transition-all"
            >
                Back to Product List
            </Link>
        </div>
    )
}