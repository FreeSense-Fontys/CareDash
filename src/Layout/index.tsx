import { Outlet } from 'react-router'

interface LogoutProps {
    Logout: () => void;
}

const Layout = ({ Logout }: LogoutProps) => {
    return (
        <div>
            <h1>Layout</h1>
            <button onClick={Logout} data-testid="logout-button">Logout</button>
            <Outlet />
        </div>
    )
}

export default Layout
