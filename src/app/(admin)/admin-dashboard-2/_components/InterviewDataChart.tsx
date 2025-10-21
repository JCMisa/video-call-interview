"use client";

import { useQuery } from "convex/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "../../../../../convex/_generated/api";

interface Interview {
  startTime: number;
}

interface ChartDataPoint {
  month: string;
  interviews: number;
}

const chartConfig = {
  interviews: {
    label: "Interviews",
    color: "#7ac142",
  },
} satisfies ChartConfig;

const InterviewDataChart = () => {
  const interviews = useQuery(api.interviews.getAllInterviews) as
    | Interview[]
    | undefined;

  if (!interviews) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading interview data...</p>
      </Card>
    );
  }

  // Process interviews data to group by month
  const interviewsByMonth = interviews.reduce(
    (acc: Record<string, ChartDataPoint>, interview) => {
      const date = new Date(interview.startTime);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, interviews: 0 };
      }
      acc[monthYear].interviews++;
      return acc;
    },
    {}
  );

  const chartData = Object.values(interviewsByMonth).sort(
    (a: ChartDataPoint, b: ChartDataPoint) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    }
  );

  // Calculate trend percentage
  const currentMonth = chartData[chartData.length - 1]?.interviews || 0;
  const previousMonth = chartData[chartData.length - 2]?.interviews || 0;
  const trendPercentage = previousMonth
    ? ((currentMonth - previousMonth) / previousMonth) * 100
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Interview Analytics</CardTitle>
        <CardDescription>
          Overview of interview activities per month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="interviewGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#7ac142" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7ac142" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={{ stroke: "#7ac142", strokeWidth: 1 }}
                  content={<ChartTooltipContent />}
                />
                <Area
                  type="monotone"
                  dataKey="interviews"
                  stroke="#7ac142"
                  strokeWidth={2}
                  fill="url(#interviewGradient)"
                  dot={{ fill: "#7ac142", r: 4 }}
                  activeDot={{ fill: "#7ac142", r: 6, strokeWidth: 2 }}
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trendPercentage > 0 ? (
                <>
                  Trending up by {Math.abs(trendPercentage).toFixed(1)}%
                  <TrendingUp className="h-4 w-4 text-[#7ac142]" />
                </>
              ) : (
                <>
                  Trending down by {Math.abs(trendPercentage).toFixed(1)}%
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </>
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {chartData[0]?.month} - {chartData[chartData.length - 1]?.month}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InterviewDataChart;
