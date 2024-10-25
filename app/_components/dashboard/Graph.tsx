"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "Monday", applications: 2 },
  { day: "Tuesday", applications: 1 },
  { day: "Wednesday", applications: 3 },
  { day: "Thursday", applications: 1 },
  { day: "Friday", applications: 4 },
  { day: "Saturday", applications: 0 },
  { day: "Sunday", applications: 1 },
];

const chartConfig = {
  applications: {
    label: "applications",
    color: "#001F3F",
  },
} satisfies ChartConfig;

export default function Graph() {
  return (
    <div className="h-36 w-60 mt-4 mx-auto md:block hidden z-20">
      <Card className="border-[#001F3F]">
        <CardHeader>
          <CardTitle>Applications Tracker</CardTitle>
          <CardDescription>Statiscal view</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                hide={true}
                domain={[-1, 'dataMax + 0.5']}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="applications"
                type="natural"
                stroke="#1b68b1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
