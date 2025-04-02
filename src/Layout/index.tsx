import { Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthProvider'

const Layout = () => {
    const { handleLogout } = useAuth()
    return (
        <div>
            <h1>Layout</h1>
            <button onClick={handleLogout} data-testid="logout-button">
                Logout
            </button>
            <Outlet />
        </div>
    )
}

export default Layout
