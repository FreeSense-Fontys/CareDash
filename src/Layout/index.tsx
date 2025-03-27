import { Outlet, useLocation } from 'react-router'
import img from '../assets/logo.webp'
import { Link } from 'react-router'

interface LogoutProps {
    Logout: () => void
}

const activeStyling = 'bg-accent rounded-tl-sml rounded-br-sml'

const Layout = ({ Logout }: LogoutProps) => {
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
                            className={`text-3xl text-center w-5/6 p-2 ${
                                isActive('/') && activeStyling
                            }`}
                        >
                            Monitor
                        </Link>
                        <Link
                            to="/configuration"
                            className={`text-3xl text-center w-5/6 p-2 ${
                                isActive('/configuration') && activeStyling
                            }`}
                        >
                            Configuration
                        </Link>
                        <Link
                            to="/presets"
                            className={`text-3xl text-center w-5/6 p-2 ${
                                isActive('/presets') && activeStyling
                            }`}
                        >
                            Presets
                        </Link>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-9/10 rounded-xsm m-2 p-2 bg-background text-black text-center">
                        <p className="text-lg">Good morning,</p>
                        <p className="text-lg">Doctor Smith</p>
                    </div>
                    <button
                        onClick={Logout}
                        data-testid="logout-button"
                        className="text-3xl bg-neutral-600 w-9/10 rounded-xsm m-2 p-2 cursor-pointer"
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
