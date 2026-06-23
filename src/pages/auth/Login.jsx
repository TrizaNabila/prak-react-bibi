import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authAPI } from "@/services/authAPI"
import AlertBox from "@/components/AlertBox"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Email dan password harus diisi.")
      return
    }

    try {
      setLoading(true)
      await authAPI.signIn(email, password)
      navigate("/")
    } catch (err) {
      setError(err.message || "Invalid login credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h2>
      {error && <AlertBox type="error">{error}</AlertBox>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Email Address</label>
          <input
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Password</label>
          <input
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:border-hijau focus:ring-2 focus:ring-hijau/20 transition-all text-sm"
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        <button 
          className="w-full py-3 mt-2 bg-hijau hover:bg-green-600 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-hijau font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  )
}
