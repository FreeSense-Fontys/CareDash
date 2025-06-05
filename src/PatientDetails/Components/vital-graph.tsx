import { Line } from 'react-chartjs-2'
import { useRef, useEffect, useState } from 'react'

export default function VitalGraph({ chartData }: any) {
    const chartRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [, setContainerWidth] = useState(0)

    // Need this, otherwise the chart does not resize correctly when container changes,
    // e.g. when the sidebar expands and collapses.
    useEffect(() => {
        if (!containerRef.current) return

        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                // Store the container width to force re-render when it changes
                setContainerWidth(containerRef.current.clientWidth)

                // Use setTimeout to ensure resize happens after React updates
                setTimeout(() => {
                    if (chartRef.current) {
                        // Force a complete update of the chart
                        chartRef.current.update('none')
                    }
                }, 0)
            }
        })

        resizeObserver.observe(containerRef.current)

        // Also listen for window resize events as a fallback
        window.addEventListener('resize', handleResize)

        function handleResize() {
            if (chartRef.current) {
                chartRef.current.resize()
                chartRef.current.update('none')
            }
        }

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // This ensures the chart is sized correctly after initial render
    useEffect(() => {
        if (chartRef.current && containerRef.current) {
            setTimeout(() => {
                chartRef.current.resize()
                chartRef.current.update('none')
            }, 50)
        }
    }, [chartData])

    return (
        <div
            className="bg-white rounded-md w-full h-full"
            ref={containerRef}
            data-testid="vital-graph"
            style={{ minHeight: '200px' }}
        >
            <Line
                ref={chartRef}
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                }}
            />
        </div>
    )
}
