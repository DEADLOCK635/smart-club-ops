"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";
import type { Database } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/utils";

interface AnalyticsChartsProps {
  db: Database;
}

export function AnalyticsCharts({ db }: AnalyticsChartsProps) {
  // 1. Calculate 14-day registration trend
  const trendData = useMemo(() => {
    const daysMap: Record<string, { date: string; confirmed: number; pending: number; total: number }> = {};
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      daysMap[key] = { date: key, confirmed: 0, pending: 0, total: 0 };
    }

    db.registrations.forEach((reg) => {
      const d = new Date(reg.createdAt);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (daysMap[key]) {
        daysMap[key].total += 1;
        if (reg.status === "confirmed") {
          daysMap[key].confirmed += 1;
        } else {
          daysMap[key].pending += 1;
        }
      }
    });

    return Object.values(daysMap);
  }, [db.registrations]);

  // 2. Calculate category breakdown
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    db.registrations.forEach((reg) => {
      const event = db.events.find((e) => e.id === reg.eventId);
      if (event) {
        counts[event.category] = (counts[event.category] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || "#22d3ee",
    }));
  }, [db.registrations, db.events]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Registration Trends Chart (7 cols) */}
      <div className="glass-card flex flex-col rounded-2xl p-6 lg:col-span-7">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-zinc-300">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Registration Velocity
              </h3>
              <p className="text-xs text-zinc-400">
                Daily activity across all arenas (Past 14 days)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Confirmed
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-zinc-500" /> Pending
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="confirmedGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pendingGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-strong rounded-xl border border-white/10 p-3 shadow-xl text-xs">
                        <p className="font-semibold text-white mb-1">{label}</p>
                        <p className="text-emerald-400">
                          Confirmed:{" "}
                          <span className="font-bold">{payload[0]?.value}</span>
                        </p>
                        {payload[1] && (
                          <p className="text-zinc-400">
                            Pending:{" "}
                            <span className="font-bold">
                              {payload[1]?.value}
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="confirmed"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#confirmedGlow)"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke="#71717a"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#pendingGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Categories Breakdown Chart (5 cols) */}
      <div className="glass-card flex flex-col rounded-2xl p-6 lg:col-span-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-zinc-300">
              <PieIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Category Distribution
              </h3>
              <p className="text-xs text-zinc-400">Share of registrations</p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#05060a"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="glass-strong rounded-xl border border-white/10 p-2.5 text-xs shadow-xl">
                          <p className="font-semibold text-white">
                            {data.name}
                          </p>
                          <p className="text-cyan-300">
                            {data.value} registrations
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-slate-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
