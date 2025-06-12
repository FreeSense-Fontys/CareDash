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
                        // data decimation removes points but keeps general shape of the graph
                        // for more information see https://www.chartjs.org/docs/latest/configuration/decimation.html
                        decimation: {
                            enabled: true,
                            algorithm: 'min-max',
                            threshold: 10,
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
