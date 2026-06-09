import { useEffect, useState } from "react"
import { notesAPI } from "@/services/notesAPI"
import AlertBox from "@/components/AlertBox"
import EmptyState from "@/components/EmptyState"
import GenericTable from "@/components/GenericTable"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Notes() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fetchError, setFetchError] = useState("")
    const [success, setSuccess] = useState("")
    const [notes, setNotes] = useState([])

    const [dataForm, setDataForm] = useState({
        title: "",
        content: "",
        status: "active",
    })

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({
            ...dataForm,
            [name]: value,
        })
    }

    const loadNotes = async () => {
        try {
            setLoading(true)
            setFetchError("")
            const data = await notesAPI.fetchNotes()
            setNotes(Array.isArray(data) ? data : [])
        } catch (err) {
            setFetchError("Gagal memuat catatan")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadNotes()
    }, [])

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        if (!dataForm.title || !dataForm.content) {
            setError("Judul dan isi catatan harus diisi.")
            setLoading(false)
            return
        }

        try {
            await notesAPI.createNote(dataForm)
            setSuccess("Catatan berhasil ditambahkan!")
            setDataForm({ title: "", content: "", status: "active" })
            setTimeout(() => setSuccess(""), 3000)
            await loadNotes()
        } catch (err) {
            setError(`Terjadi kesalahan: ${err?.message ?? "Server error"}`)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        const konfirmasi = confirm("Yakin ingin menghapus catatan ini?")
        if (!konfirmasi) return

        try {
            setLoading(true)
            setError("")
            setSuccess("")

            await notesAPI.deleteNote(id)
            setSuccess("Catatan berhasil dihapus!")
            setTimeout(() => setSuccess(""), 3000)
            await loadNotes()
        } catch (err) {
            setError(`Terjadi kesalahan: ${err?.message ?? "Server error"}`)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl">
                <div className="rounded-[40px] bg-white p-10 shadow-[0_35px_60px_-40px_rgba(15,23,42,0.1)] border border-slate-200">
                    <h1 className="mb-9 text-4xl font-semibold text-slate-950">Notes App</h1>

                    {success && (
                        <div className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 px-6 py-4 text-sm font-semibold text-emerald-800">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-6 py-4 text-sm font-semibold text-red-800">
                            {error}
                        </div>
                    )}

                    <div className="rounded-[32px] bg-white p-8 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.15)] border border-slate-200">
                        <h2 className="mb-6 text-xl font-semibold text-slate-900">Tambah Catatan Baru</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={dataForm.title}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full rounded-[28px] border border-slate-200 bg-slate-100 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-hijau focus:ring-2 focus:ring-hijau/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    placeholder="Judul catatan"
                                />
                            </div>

                            <div>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={dataForm.content}
                                    onChange={handleChange}
                                    rows={6}
                                    disabled={loading}
                                    className="w-full rounded-[28px] border border-slate-200 bg-slate-100 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-hijau focus:ring-2 focus:ring-hijau/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    placeholder="Isi catatan"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-[28px] bg-hijau px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Mohon Tunggu..." : "Tambah Data"}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 rounded-[32px] bg-white p-8 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.15)] border border-slate-200">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900">Daftar Catatan ({notes.length})</h2>
                        </div>

                        {loading ? (
                            <LoadingSpinner text="Memuat catatan..." />
                        ) : null}

                        {!loading && notes.length === 0 && !fetchError ? (
                            <EmptyState text="Belum ada catatan" />
                        ) : null}

                        {!loading && fetchError ? (
                            <AlertBox type="error">{fetchError}</AlertBox>
                        ) : null}

                        {!loading && notes.length > 0 ? (
                            <GenericTable
                                columns={["No.", "Judul", "Isi", "Aksi"]}
                                data={notes}
                                renderRow={(note, index) => (
                                    <>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{index + 1}.</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{note.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{note.content}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(note.id)}
                                                disabled={loading}
                                                className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </>
                                )}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
