import { Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthProvider'
import { Link, useLocation } from 'react-router-dom'
import img from '../assets/logo.webp'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const activeStyling =
        'bg-accent rounded-tl-sml rounded-br-sml overflow-hidden'
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path
    return (
        <div className="flex flex-row">
            <div className="flex flex-col bg-secondary h-screen w-1/5 justify-between text-white items-center">
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={img}
                        alt="logo"
                        data-testid="layout-logo"
                        className="w-5/6 p-4"
                    />
                    <div className="flex flex-col items-center justify-center space-y-4 pt-14 w-full">
                        <Link
                            to="/"
                            className={`text-3xl truncate text-center w-5/6 p-2 ${
                                isActive('/') && activeStyling
                            }`}
                            data-testid="monitor-link"
                        >
                            Monitor
                        </Link>
                        <Link
                            to="/configuration"
                            className={`text-3xl truncate text-center w-5/6 p-2 ${
                                isActive('/configuration') && activeStyling
                            }`}
                            data-testid="configuration-link"
                        >
                            Configuration
                        </Link>
                        <Link
                            to="/presets"
                            className={`text-3xl truncate text-center w-5/6 p-2 ${
                                isActive('/presets') && activeStyling
                            }`}
                            data-testid="presets-link"
                        >
                            Presets
                        </Link>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-9/10 rounded-xsm m-2 p-2 bg-background text-black text-center">
                        <p className="text-lg truncate">Good morning,</p>
                        <p className="text-lg truncate">Dr. {user?.lastName}</p>
                    </div>
                    <button
                        onClick={() => {
                            handleLogout()
                            navigate('/login')
                        }}
                        data-testid="logout-button"
                        className="text-3xl truncate bg-neutral-600 w-9/10 rounded-xsm m-2 p-2 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Layout
