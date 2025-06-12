interface TimingSection {
    tInterval: string[]
}

const TimingSection = ({ tInterval }: TimingSection) => {
    return (
        <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Timing</h2>
            <div className="col-span-3 flex gap-6">
                <div className="flex-1 space-y-2">
                    <div className="flex items-start p-2 bg-gray-100 border-l-4 border-gray-500 rounded">
                        <p className="text-grey-700">
                            Measurements taken every {tInterval} minutes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TimingSection
