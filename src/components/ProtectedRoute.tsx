import { Navigate } from 'react-router'
import { useAuth } from '../contexts/AuthProvider'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}

export default ProtectedRoute
