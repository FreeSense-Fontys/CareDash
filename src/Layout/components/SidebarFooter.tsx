import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'

interface SidebarFooterProps {
    collapsed: boolean
    user: any
    handleLogout: () => void
}

const SidebarFooter = ({
    collapsed,
    user,
    handleLogout,
}: SidebarFooterProps) => {
    const navigate = useNavigate()

    return (
        <div
            className={`w-full flex flex-col items-center justify-center mb-4`}
        >
            {!collapsed && (
                <div className="w-9/10 px-2 rounded-xsm m-2 p-2 bg-background text-black text-center transition-opacity duration-200 ease-in-out">
                    <p className="text-lg truncate">Good morning,</p>
                    <p className="text-lg truncate">Dr. {user?.lastName}</p>
                </div>
            )}

            <button
                onClick={() => {
                    handleLogout()
                    navigate('/login')
                }}
                data-testid="logout-button"
                className={`flex text-xl items-center bg-neutral-600 rounded-xsm m-2 p-2 cursor-pointer ${
                    collapsed
                        ? 'justify-center w-12 h-12 aspect-square'
                        : 'justify-center gap-2 w-9/10 transition-all duration-200 ease-in-out'
                }`}
                title="Logout"
            >
                {!collapsed && <span>Logout</span>}
                <LogoutIcon />
            </button>
        </div>
    )
}

export default SidebarFooter
