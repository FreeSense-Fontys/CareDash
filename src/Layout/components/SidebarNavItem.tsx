import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface SidebarNavItemProps {
    to: string
    icon: ReactNode
    label: string
    testId: string
    collapsed: boolean
}

const SidebarNavItem = ({
    to,
    icon,
    label,
    testId,
    collapsed,
}: SidebarNavItemProps) => {
    const location = useLocation()
    const isActive = location.pathname === to

    const activeStyling =
        'bg-accent rounded-tl-sml rounded-br-sml overflow-hidden'

    return (
        <Link
            to={to}
            className={`flex text-xl items-center p-2 gap-2 transition-all duration-200 ease-in-out justify-center w-9/10 ${
                isActive && activeStyling
            }`}
            data-testid={testId}
        >
            <span className="flex-shrink-0">{icon}</span>
            {!collapsed && <p className="truncate">{label}</p>}
        </Link>
    )
}

export default SidebarNavItem
