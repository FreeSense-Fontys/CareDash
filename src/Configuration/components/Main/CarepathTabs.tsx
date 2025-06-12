import { CoupledWearable } from '../../../types/CoupledWearable'

interface CarepathTabsProps {
    coupledWearables: CoupledWearable[]
    setActiveCarepath: (carepath: string) => void
    setSelectedWearableId: (wearableId: string) => void
    activeCarepath: string
}

const CarepathTabs = ({
    coupledWearables,
    setActiveCarepath,
    setSelectedWearableId,
    activeCarepath,
}: CarepathTabsProps) => {
    return (
        <div className="border-b mb-6">
            <div className="flex">
                {coupledWearables.map((carepath) => (
                    <button
                        key={carepath.productName}
                        onClick={() => {
                            setActiveCarepath(carepath.productName)
                            setSelectedWearableId(carepath.wearableId)
                        }}
                        className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors duration-150 border-b-2 ${
                            activeCarepath === carepath.productName
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'bg-gray-100 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                        }`}
                    >
                        {carepath.productName}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default CarepathTabs
