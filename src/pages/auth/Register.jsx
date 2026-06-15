import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "@/services/authAPI"
import AlertBox from "@/components/AlertBox"

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
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
      const res = await authAPI.signUp(email, password)
      if (res && res.session) {
        navigate("/")
        return
      }
      setSuccess("Pendaftaran berhasil. Silakan login menggunakan akun yang baru dibuat.")
      navigate("/login")
    } catch (err) {
      setError(err.message || "Gagal mendaftar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
        {error && <AlertBox type="danger" message={error} />}
        {success && <AlertBox type="success" message={success} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-500">Email Address</label>
            <input
              id="register-email"
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
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 input"
              type="password"
              placeholder="Your password"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500">Confirm Password</label>
            <input
              id="register-confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 input"
              type="password"
              placeholder="Confirm password"
            />
          </div>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  )
}
