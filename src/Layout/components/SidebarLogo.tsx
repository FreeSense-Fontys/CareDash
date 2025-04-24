import img from '../../assets/logo.webp'

interface SidebarLogoProps {
    collapsed: boolean
}

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
    return (
        <div className={`flex justify-center items-center p-4 mt-3 w-full`}>
            <img
                src={img || '/placeholder.svg'}
                alt="CareDash"
                data-testid="layout-logo"
                className={`${
                    collapsed ? 'w-10' : 'w-full'
                } transition-all duration-200 ease-in-out`}
            />
        </div>
    )
}

export default SidebarLogo
