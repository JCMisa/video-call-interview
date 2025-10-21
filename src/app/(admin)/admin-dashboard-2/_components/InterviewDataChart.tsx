"use client";

import { useQuery } from "convex/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../../../../convex/_generated/api";

export default function InterviewDataChart() {
  /* 1️⃣  grab every student that already selected a track */
  const tracks = useQuery(api.track.getAllTracks); // ← we create this below

  /* 2️⃣  derive counts */
  const summary = (() => {
    if (!tracks) return [];
    const totals: Record<string, number> = { TVL: 0, Academic: 0 };
    tracks.forEach((t: any) => {
      totals[t.value] = (totals[t.value] || 0) + 1;
    });
    return [
      { name: "TVL", total: totals.TVL },
      { name: "Academic", total: totals.Academic },
    ];
  })();

  /* 3️⃣  responsive chart */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student track choice</CardTitle>
        <CardDescription>
          How many students selected each senior-high track
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={summary}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
            <YAxis stroke="currentColor" fontSize={12} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {summary.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={entry.name === "Academic" ? "#03a9f4" : "#ff9800"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
