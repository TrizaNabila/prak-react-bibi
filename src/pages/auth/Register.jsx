import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authAPI } from "@/services/authAPI"
import AlertBox from "@/components/AlertBox"

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!email || !password) {
      setError("Email dan password harus diisi.")
      return
    }
    if (password !== confirm) {
      setError("Password dan konfirmasi tidak sama.")
      return
    }

    try {
      setLoading(true)
      await authAPI.signUp(email, password, name, phone)
      setSuccess("Pendaftaran berhasil! Silakan login.")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setError(err.message || "Gagal mendaftar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account 🚀</h2>
      {error && <AlertBox type="error">{error}</AlertBox>}
      {success && <AlertBox type="success">{success}</AlertBox>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Full Name</label>
          <input
            id="register-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Phone Number</label>
          <input
            id="register-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="text"
            placeholder="08123456789"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email Address</label>
          <input
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            id="register-confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full mt-1 px-4 py-2.5 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="password"
            placeholder="Confirm password"
            required
          />
        </div>

        <button 
          className="w-full py-3 mt-2 bg-hijau hover:bg-green-600 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-hijau font-bold hover:underline">
          Login
        </Link>
      </div>
    </div>
  )
}
