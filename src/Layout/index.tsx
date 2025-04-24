import { Outlet } from 'react-router'
import { useAuth } from '../contexts/AuthProvider'
import { Link, useLocation } from 'react-router-dom'
import img from '../assets/logo.webp'
import { useNavigate } from 'react-router-dom'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import { MdDisplaySettings } from 'react-icons/md'
import { LiaNotesMedicalSolid } from 'react-icons/lia'
import LogoutIcon from '@mui/icons-material/Logout'

const Layout = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const activeStyling =
        'bg-accent rounded-tl-sml rounded-br-sml overflow-hidden'
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path
    return (
        <div className="flex flex-row ">
            <div className="flex flex-col bg-secondary h-screen w-1/5 justify-between text-white items-center ">
                <div className="flex flex-col items-center justify-center ">
                    <img
                        src={img}
                        alt="logo"
                        data-testid="layout-logo"
                        className="w-5/6 p-4 mt-3"
                    />
                    <div className="flex text-center flex-col items-center justify-center space-y-4 pt-10 w-full">
                        <Link
                            to="/"
                            className={` flex text-xl truncate justify-center items-center w-5/6 p-2 gap-2 ${
                                isActive('/') && activeStyling
                            }`}
                            data-testid="monitor-link"
                        >
                            <MonitorHeartIcon /> Monitor
                        </Link>
                        <Link
                            to="/configuration"
                            className={`flex text-xl truncate justify-center items-center w-5/6 p-2 gap-2 ${
                                isActive('/configuration') && activeStyling
                            }`}
                            data-testid="configuration-link"
                        >
                            <MdDisplaySettings />
                            <p className="truncate">Configuration</p>
                        </Link>
                        <Link
                            to="/presets"
                            className={`flex text-xl truncate justify-center items-center w-5/6 p-2 gap-2 ${
                                isActive('/presets') && activeStyling
                            }`}
                            data-testid="presets-link"
                        >
                            <LiaNotesMedicalSolid /> Presets
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
                        className="flex text-xl truncate justify-center gap-2 items-center bg-neutral-600 w-9/10 rounded-xsm m-2 p-2 cursor-pointer"
                    >
                        Logout <LogoutIcon />
                    </button>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Layout
