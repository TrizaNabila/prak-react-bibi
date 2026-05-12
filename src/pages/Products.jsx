import { Link, useParams } from "react-router-dom";
import productsData from "../data/Products.json"; 
import PageHeader from "../components/PageHeader";

export default function Products() {
  const { id } = useParams();

  // Mencari data produk berdasarkan ID dari URL
  const selectedProduct = productsData.find((item) => item.id === parseInt(id));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader title="Products" />
      <p className="text-gray-400 text-sm mb-6">Dashboard / Product List</p>

      {/* Tampilan tetap dinamis: Full width jika belum diklik, mengecil jika detail muncul */}
      <div className={selectedProduct ? "grid grid-cols-1 lg:grid-cols-4 gap-6" : "w-full"}>
        
        {/* TABEL DENGAN KOLOM LENGKAP */}
        <div className={selectedProduct ? "lg:col-span-3" : "w-full"}>
          <div className="overflow-hidden rounded-xl shadow-sm bg-white border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#009262] text-white text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-r border-green-600">Code</th>
                  <th className="p-4 font-bold border-r border-green-600">Product Name</th>
                  <th className="p-4 font-bold border-r border-green-600">Category</th>
                  <th className="p-4 font-bold border-r border-green-600">Brand</th>
                  <th className="p-4 font-bold border-r border-green-600 text-right">Price</th>
                  <th className="p-4 font-bold text-center">Stock</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {productsData.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      parseInt(id) === product.id ? "bg-green-50" : ""
                    }`}
                  >
                    <td className="p-4 text-gray-400 border-r border-gray-100 uppercase">
                      {product.code} {/* Sesuai field 'code' di JSON */}
                    </td>
                    <td className="p-4 border-r border-gray-100">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-[#009262] font-bold hover:underline"
                      >
                        {product.tittle} {/* Sesuai field 'tittle' di JSON */}
                      </Link>
                    </td>
                    <td className="p-4 border-r border-gray-100">
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 border-r border-gray-100 text-gray-500">
                      {product.brand || "Essence"}
                    </td>
                    <td className="p-4 border-r border-gray-100 text-right font-bold text-gray-700">
                      Rp {product.price?.toLocaleString("id-ID") || "9.990"}
                    </td>
                    <td className={`p-4 text-center font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                      {product.stock || "25"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BAGIAN DETAIL (Sebelah Kanan) */}
        {selectedProduct && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8 animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="flex justify-center mb-6 bg-gray-50 py-8 rounded-xl">
                <img
                  src={selectedProduct.image || "https://via.placeholder.com/150"}
                  alt={selectedProduct.tittle}
                  className="h-40 object-contain"
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedProduct.tittle}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Category</span>
                  <span className="text-sm font-semibold text-gray-700 uppercase">{selectedProduct.category}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Brand</span>
                  <span className="text-sm font-semibold text-gray-700">{selectedProduct.brand || "Essence"}</span>
                </div>
                <div className="pt-4">
                  <span className="text-xs text-[#009262] font-bold uppercase block mb-1">Price</span>
                  <p className="text-2xl font-black text-gray-900">
                    Rp {selectedProduct.price?.toLocaleString("id-ID") || "9.990"}
                  </p>
                </div>
              </div>

              <Link 
                to="/products" 
                className="mt-6 block text-center py-2 bg-gray-50 text-gray-400 hover:text-red-500 text-xs font-bold rounded-lg transition-colors"
              >
                CLOSE DETAIL
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}