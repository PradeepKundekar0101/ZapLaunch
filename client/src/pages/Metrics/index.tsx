import { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { Project } from "@/types/data";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import moment from "moment";
import { getDateRange } from "@/utils/getDateRange";
import { LineChartComponent } from "./LineChart";

const Metrics = ({ project }: { project: Project }) => {
  type TimePeriod =
    | "overall"
    | "lastYear"
    | "lastMonth"
    | "lastWeek"
    | "lastDay";

  const [timePeriod, setTimePeriod] = useState<TimePeriod>("overall");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: moment(project.createdAt).add(-1, "day").format("YYYY-MM-DD"),
    to: moment(new Date()).format("YYYY-MM-DD"),
  });

  useEffect(() => {
    const newRange = getDateRange(timePeriod, project);
    setDateRange(newRange);
  }, [timePeriod]);

  const api = useAxios();
  const {
    data: visitTrend,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["metrics", project?.projectName, dateRange],
    queryFn: async () => {
      return (
        await api.get(
          `analytics/visitTrend/${project?.projectName}?fromDate=${dateRange.from}&toDate=${dateRange.to}`
        )
      ).data;
    },
  });


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{visitTrend?.todayCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{visitTrend?.totalVisits}</p>
          </CardContent>
        </Card>
      </div>
      <LineChartComponent
        timePeriod={timePeriod}
        chartData={visitTrend.dailyTrends}
        setTimePeriod={setTimePeriod}
      />
      <Card>
        <CardContent className="h-80">
          <p className="text-lg">{visitTrend?.trendDescription}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Metrics;
