"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import type { DistributionPoint, TrendPoint } from "@/frontend/types";

type ChartCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="dashboard-shell ambient-border p-5">
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-600">
          Signal layer
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-ink-soft">{description}</p>
      </div>
      <div className="mt-6 h-[280px]">{children}</div>
    </div>
  );
}

export function AreaTrendCard({
  title,
  description,
  data,
  color = "#df3648",
}: {
  title: string;
  description: string;
  data: TrendPoint[];
  color?: string;
}) {
  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`${title}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.32} />
              <stop offset="95%" stopColor={color} stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,26,33,0.08)" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} />
          <Tooltip />
          <Area
            dataKey="value"
            type="monotone"
            stroke={color}
            strokeWidth={3}
            fill={`url(#${title}-fill)`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function BarTrendCard({
  title,
  description,
  data,
  color = "#be223c",
}: {
  title: string;
  description: string;
  data: TrendPoint[];
  color?: string;
}) {
  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(113,26,33,0.08)" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[12, 12, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DistributionDonutCard({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: DistributionPoint[];
}) {
  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={102}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill ?? "#df3648"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.fill ?? "#df3648" }}
              />
              {entry.name}
            </span>
            <span className="font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
