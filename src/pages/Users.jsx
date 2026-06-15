import { useEffect, useState } from "react"
import { usersAPI } from "@/services/usersAPI"
import AlertBox from "@/components/AlertBox"
import EmptyState from "@/components/EmptyState"
import GenericTable from "@/components/GenericTable"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    id: null,
    email: "",
    role: "user",
  })
  const [isEditing, setIsEditing] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await usersAPI.fetchUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || "Gagal memuat data pengguna")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = (evt) => {
    const { name, value } = evt.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.email) {
      setError("Email harus diisi.")
      return
    }

    try {
      setLoading(true)
      if (isEditing && formData.id) {
        await usersAPI.updateUser(formData.id, {
          email: formData.email,
          role: formData.role,
        })
        setSuccess("User berhasil diperbarui.")
      } else {
        await usersAPI.createUser({
          email: formData.email,
          role: formData.role,
        })
        setSuccess("User berhasil ditambahkan.")
      }
      setFormData({ id: null, email: "", role: "user" })
      setIsEditing(false)
      setTimeout(() => setSuccess(""), 3000)
      await loadUsers()
    } catch (err) {
      setError(err?.message || "Gagal menyimpan user")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      email: user.email || "",
      role: user.role || "user",
    })
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setFormData({ id: null, email: "", role: "user" })
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const handleDelete = async (id) => {
    const confirmed = confirm("Yakin ingin menghapus user ini?")
    if (!confirmed) return

    try {
      setLoading(true)
      setError("")
      await usersAPI.deleteUser(id)
      setSuccess("User berhasil dihapus.")
      setTimeout(() => setSuccess(""), 3000)
      await loadUsers()
    } catch (err) {
      setError(err?.message || "Gagal menghapus user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-[40px] bg-white p-10 shadow-[0_35px_60px_-40px_rgba(15,23,42,0.1)] border border-slate-200">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-slate-950">Users</h1>
              <p className="text-sm text-slate-500">Kelola data user admin dengan Supabase.</p>
            </div>
          </div>

          {success && <AlertBox type="success">{success}</AlertBox>}
          {error && <AlertBox type="error">{error}</AlertBox>}

          <div className="mb-8 rounded-[32px] bg-slate-50 p-6 border border-slate-200">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              {isEditing ? "Edit User" : "Tambah User Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-hijau focus:ring-2 focus:ring-hijau/20 disabled:cursor-not-allowed"
                  placeholder="user@example.com"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-hijau focus:ring-2 focus:ring-hijau/20 disabled:cursor-not-allowed"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="sm:col-span-1 flex items-end gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-hijau px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Mohon Tunggu..." : isEditing ? "Simpan Perubahan" : "Tambah User"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {loading ? (
            <LoadingSpinner text="Memuat data user..." />
          ) : !loading && users.length === 0 ? (
            <EmptyState text="Belum ada pengguna" />
          ) : (
            <GenericTable
              columns={["No.", "Email", "Role", "Aksi"]}
              data={users}
              renderRow={(user, index) => (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{index + 1}.</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.role ?? "user"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                      className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                      className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Hapus
                    </button>
                  </td>
                </>
              )}
            />
          )}
        </div>
      </div>
    </div>
  )
}
