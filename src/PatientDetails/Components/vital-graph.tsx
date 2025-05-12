import { Line } from "react-chartjs-2";

export default function VitalGraph({ chartData }: any) {
  console.log(chartData)
  return (
    <div className="chart-container" style={{ position: "relative", width: "50%", height: "300px" }}>
      <Line
        data={chartData}
        
        options={{
          plugins: {
            datalabels: {
              display: false,
            },
            title: {
              display: false,
            }
          },
          elements: {
            point: {
              radius: 0
            }
          },

          interaction: {
            intersect: false
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
}