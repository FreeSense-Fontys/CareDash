import { Line } from 'react-chartjs-2'

export default function VitalGraph({ chartData }: any) {
    return (
        <div className="bg-white rounded-md">
            <Line
                data={chartData}
                options={{
                    plugins: {
                        datalabels: {
                            display: false,
                        },
                        title: {
                            display: false,
                        },
                    },
                    elements: {
                        point: {
                            radius: 0,
                        },
                    },

                    interaction: {
                        intersect: false,
                    },
                    maintainAspectRatio: false,
                }}
            />
        </div>
    )
}
