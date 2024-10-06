import React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Visit Trend";

const chartConfig = {
  desktop: {
    label: "Visit",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type TimePeriod = "overall" | "lastYear" | "lastMonth" | "lastWeek" | "lastDay";

export function LineChartComponent({
  setTimePeriod,
  chartData,
  timePeriod,
}: {
  timePeriod: TimePeriod;
  setTimePeriod: React.Dispatch<React.SetStateAction<TimePeriod>>;
  chartData: { date: string; count: number }[];
}) {
  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem);
    switch (timePeriod) {
      case "overall":
      case "lastYear":
        return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      case "lastMonth":
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      case "lastWeek":
        return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
      case "lastDay":
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      default:
        return tickItem;
    }
  };

  const getTickInterval = () => {
    switch (timePeriod) {
      case "overall":
        return 30; 
      case "lastYear":
        return 30; 
      case "lastMonth":
        return 5; 
      case "lastWeek":
        return 1; 
      case "lastDay":
        return 2; 
      default:
        return 1;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            <h1>Visits Trend</h1>
          </div>
          <div>
            <Select
              value={timePeriod}
              defaultValue={"overall"}
              onValueChange={(value: TimePeriod) => setTimePeriod(value)}
            >
              <div className="flex items-center space-x-1">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={"overall"} value={"overall"}>
                    Overall
                  </SelectItem>
                  <SelectItem key={"lastYear"} value={"lastYear"}>
                    Last one Year
                  </SelectItem>
                  <SelectItem key={"lastMonth"} value={"lastMonth"}>
                    Last 30 days
                  </SelectItem>
                  <SelectItem key={"lastWeek"} value={"lastWeek"}>
                    Last 7 days
                  </SelectItem>
                  <SelectItem key={"lastDay"} value={"lastDay"}>
                    Last 24 hours
                  </SelectItem>
                </SelectContent>
              </div>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            height={200}
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 12,
              left: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={2}
              tickFormatter={formatXAxisTick}
              interval={getTickInterval()}
              textAnchor="end"
              height={30}
              fontSize={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}