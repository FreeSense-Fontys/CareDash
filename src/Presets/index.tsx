import PresetDashboard from './components/PresetDashboard'
import { PresetProvider } from './components/PresetProvider'

function PresetsPage() {
    return (
        <div className="w-full overflow-hidden">
            <div className="bg-white h-screen flex flex-col">
                <div className="mx-auto bg-white p-4 rounded-lg flex flex-col w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            CareBuddy Configuration
                        </h1>
                        {/* <div className={` pr-4 mt-3 h-10 w-auto`}>
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-14 w-auto"
                            />
                        </div> */}
                    </div>
                    <PresetProvider>
                        <PresetDashboard />
                    </PresetProvider>
                </div>
            </div>
        </div>
    )
}
export default PresetsPage
