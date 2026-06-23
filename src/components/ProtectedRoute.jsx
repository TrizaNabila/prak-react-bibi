import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { authAPI } from "@/services/authAPI"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ProtectedRoute({ children, allowedRoles }) {
    const [checking, setChecking] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)
    const [authorized, setAuthorized] = useState(true)
    const location = useLocation()

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { session } = await authAPI.getSession()
                
                if (session && session.user) {
                    setAuthenticated(true)
                    
                    if (allowedRoles) {
                        const userRole = session.user.profile?.role || "member"
                        setAuthorized(allowedRoles.includes(userRole))
                    } else {
                        setAuthorized(true)
                    }
                } else {
                    setAuthenticated(false)
                }
            } catch (err) {
                setAuthenticated(false)
                setAuthorized(false)
            } finally {
                setChecking(false)
            }
        }

        checkSession()
    }, [allowedRoles])

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

    if (!authorized) {
        return <Navigate to="/error-403" replace />
    }

    return children
}
