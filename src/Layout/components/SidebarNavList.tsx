import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import { MdDisplaySettings } from 'react-icons/md'
import { LiaNotesMedicalSolid } from 'react-icons/lia'
import SidebarNavItem from './SidebarNavItem'

interface SidebarNavListProps {
    collapsed: boolean
}

const SidebarNavList = ({ collapsed }: SidebarNavListProps) => {
    const navItems = [
        {
            to: '/',
            icon: <MonitorHeartIcon />,
            label: 'Monitor',
            testId: 'monitor-link',
        },
        {
            to: '/configuration',
            icon: <MdDisplaySettings />,
            label: 'Configuration',
            testId: 'configuration-link',
        },
        {
            to: '/presets',
            icon: <LiaNotesMedicalSolid />,
            label: 'Presets',
            testId: 'presets-link',
        },
    ]

    return (
        <div
            className={`flex text-center flex-col items-center justify-center space-y-4 pt-10 w-full`}
        >
            {navItems.map((item) => (
                <SidebarNavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    testId={item.testId}
                    collapsed={collapsed}
                />
            ))}
        </div>
    )
}

export default SidebarNavList
