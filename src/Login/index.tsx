import LoginForm from './components/LoginForm'
import img from '../assets/logo.webp'

const Login = () => {
    return (
        <div className="flex flex-row bg-linear-to-r from-login-background to-primary h-screen w-screen">
            <div id="Left" className="w-1/2 flex items-center justify-center">
                <img src={img} alt="logo" data-testid="login-logo" />
            </div>
            <div id="Right" className="w-1/2 flex items-center justify-center">
                <LoginForm />
            </div>
        </div>
    )
}

export default Login
