import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { authAPI } from "@/services/authAPI"
import LoadingSpinner from "@/components/LoadingSpinner"

const DEV_AUTH = import.meta.env.VITE_DEV_AUTH === "true"

export default function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const checkSession = async () => {
            try {
                if (DEV_AUTH) {
                    const { session } = await authAPI.getSession()
                    setAuthenticated(Boolean(session && session.user))
                } else {
                    const { session } = await authAPI.getSession()
                    setAuthenticated(Boolean(session))
                }
            } catch (err) {
                setAuthenticated(false)
            } finally {
                setChecking(false)
            }
        }

        checkSession()
    }, [])

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <LoadingSpinner text="Memeriksa autentikasi..." />
            </div>
        )
    }

    if (!authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}
