import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
import SidebarLogo from './SidebarLogo'
import SidebarNavList from './SidebarNavList'
import SidebarFooter from './SidebarFooter'

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true)
    const { user, handleLogout } = useAuth()

    const handleMouseEnter = () => {
        setCollapsed(false)
    }

    const handleMouseLeave = () => {
        setCollapsed(true)
    }

    return (
        <div
            className={`flex flex-col bg-secondary h-screen justify-between text-white items-center transition-all duration-300 ease-in-out ${
                collapsed ? 'w-20' : 'w-1/5'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex flex-col items-center justify-center w-full">
                <SidebarLogo collapsed={collapsed} />
                <SidebarNavList collapsed={collapsed} />
            </div>

            <SidebarFooter
                collapsed={collapsed}
                user={user}
                handleLogout={handleLogout}
            />
        </div>
    )
}

export default Sidebar
