import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function AssetTypeBarChart({ data = [] }) {
  const chartData = data && data.length > 0 ? data : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-semibold text-brand-300">{label}</div>
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
          <h3 className="text-base font-bold text-slate-900">Infrastructure by Classification</h3>
          <p className="text-xs text-slate-500">Breakdown across Roads, Bridges, Flyovers & Buildings</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-100">
          {chartData.length} Types
        </span>
      </div>

      <div className="h-60 w-full mt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No infrastructure classification data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
            >
              <defs>
                <linearGradient id="rnbTypeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#3730a3" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
              <Bar
                dataKey="count"
                fill="url(#rnbTypeGradient)"
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>Highest portfolio volume: <strong className="text-slate-800">{chartData[0]?.name || 'N/A'}</strong></span>
        <span>Count: <strong className="text-slate-800">{chartData[0]?.count || 0} units</strong></span>
      </div>
    </div>
  );
}
