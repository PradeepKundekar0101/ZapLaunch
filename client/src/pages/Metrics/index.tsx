import { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { Project } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { getDateRange } from "@/utils/getDateRange";
import { LineChartComponent } from "./LineChart";
import { Geo } from "./Geo";
import { Skeleton } from "@/components/ui/skeleton";

const Metrics = ({ project }: { project: Project }) => {
  type TimePeriod =
    | "overall"
    | "lastYear"
    | "lastMonth"
    | "lastWeek"
    | "lastDay";

  const [timePeriod, setTimePeriod] = useState<TimePeriod>("lastWeek");
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
    isLoading: isDailyTrendLoading,
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
  const { data: geoData, isLoading: isGeoDataLoading } = useQuery({
    queryKey: ["geoData"],
    queryFn: async () => {
      return (await api.get(`analytics/geo/${project?.projectName}`)).data;
    },
  });

  const renderContent = () => {
    if (error) return <div>Error fetching data</div>;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Visits</CardTitle>
            </CardHeader>
            {isDailyTrendLoading ? (
              <Skeleton className="h-10 w-20 m-3 " />
            ) : (
              <CardContent>
                <p className="text-4xl font-bold">{visitTrend?.todayCount}</p>
              </CardContent>
            )}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Visits</CardTitle>
            </CardHeader>
            {isDailyTrendLoading ? (
              <Skeleton className="h-10 w-20 m-3 " />
            ) : (
              <CardContent>
                <p className="text-4xl font-bold">{visitTrend?.totalVisits}</p>
              </CardContent>
            )}
          </Card> 
        </div>
        <div className="flex w-full justify-between space-x-3">
          <div className="w-1/2">
            {isDailyTrendLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <LineChartComponent
                timePeriod={timePeriod}
                chartData={visitTrend?.dailyTrends}
                setTimePeriod={setTimePeriod}
              />
            )}
          </div>
          <Card className="w-1/2">
            <CardContent className="h-[400px]">
              {isGeoDataLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <Geo data={geoData} />
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  return <div className="space-y-4">{renderContent()}</div>;
};

export default Metrics;
