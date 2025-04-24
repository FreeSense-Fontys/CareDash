import { Outlet } from 'react-router'
import Sidebar from './components/Sidebar'

const Layout = () => {
    return (
        <div className="flex flex-row ">
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default Layout
