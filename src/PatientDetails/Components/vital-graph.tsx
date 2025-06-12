import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'

export default function VitalGraph({ chartData }: any) {
    return (
        <div
            className="bg-white rounded-md w-full h-full"
            data-testid="vital-graph"
            style={{ minHeight: '200px' }}
        >
            <Line
                // could look into data decimation for performance improvements
                data={chartData}
                options={{
                    animation: false,
                    parsing: false,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        datalabels: {
                            display: false,
                        },
                        title: {
                            display: false,
                        },
                        decimation: {
                            enabled: true,
                            algorithm: 'lttb',
                            samples: 10,
                        },
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'hour',
                                displayFormats: {
                                    hour: 'HH:mm',
                                },
                            },
                            title: {
                                display: true,
                                text: 'Time',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Vital Value',
                            },
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
                }}
            />
        </div>
    )
}
