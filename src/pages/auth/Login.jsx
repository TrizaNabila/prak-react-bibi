import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back 👋</h2>
        {error && <AlertBox type="danger" message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-500">Email Address</label>
            <input
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 input"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500">Password</label>
            <input
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 input"
              type="password"
              placeholder="Your password"
            />
          </div>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
