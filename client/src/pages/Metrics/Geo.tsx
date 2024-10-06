import  { useMemo } from "react";
import { Chart } from "react-google-charts";

export const options = {
  backgroundColor: "#020617",
  colorAxis: {
    colors: [
      "#0053fa",
      "#1260fc",
      "#3778fa",
      "#528afa",
      "#72a0fc",
      "#8db2fc",
      "#b3ccfc",
   
    ].reverse(),
  },
};

export function Geo({ data }: { data: Record<string, number> }) {
  const chartData = useMemo(() => {
    const formattedData = Object.entries(data).map(([country, visits]) => [country, visits]);
    return [["Country", "Visits"], ...formattedData];
  }, [data]);

  return (
    <Chart
      options={options}
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper?.getChart();
            const selection = chart?.getSelection();
            if (selection && selection.length > 0) {
              const [selectedItem] = selection;
              const country = chartData[selectedItem.row + 1][0];
              const visits = chartData[selectedItem.row + 1][1];
              console.log(`Selected: ${country} with ${visits} visits`);
            }
          },
        },
      ]}
      chartType="GeoChart"
      width="100%"
      height="100%"
      data={chartData}
    />
  );
}