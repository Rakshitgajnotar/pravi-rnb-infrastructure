import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

const CONDITION_COLORS = {
  Excellent: '#10b981', // green
  Good: '#3b82f6',      // blue
  Fair: '#f59e0b',      // amber
  Poor: '#f97316',      // orange
  Critical: '#ef4444',  // red
};

export default function ConditionBarChart({ data = [] }) {
  const chartData = data && data.length > 0 ? data : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-semibold flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CONDITION_COLORS[label] || '#94a3b8' }}
            />
            {label} Condition
          </div>
          <div className="text-slate-200">
            {payload[0].value} {payload[0].value === 1 ? 'Asset' : 'Assets'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Physical Condition Index</h3>
          <p className="text-xs text-slate-500">Structural integrity assessments from field audits</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
          Audit Ratings
        </span>
      </div>

      <div className="h-60 w-full mt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No condition audit data recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.color || CONDITION_COLORS[entry.name] || '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Critical Condition: <strong className="text-rose-600">{chartData.find((c) => c.name === 'Critical')?.count || 0} units</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Satisfactory: <strong className="text-emerald-700">
            {(chartData.find((c) => c.name === 'Excellent')?.count || 0) +
             (chartData.find((c) => c.name === 'Good')?.count || 0)} units
          </strong>
        </span>
      </div>
    </div>
  );
}
