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

export default function DistrictBarChart({ data = [] }) {
  const chartData = data && data.length > 0 ? data : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-semibold text-cyan-300">{label} District</div>
          <div className="text-slate-200">
            {payload[0].value} Registered Infrastructure Assets
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
          <h3 className="text-base font-bold text-slate-900">Geographic District Spread</h3>
          <p className="text-xs text-slate-500">Asset distribution across state administrative districts</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-50 text-cyan-800 rounded-full border border-cyan-200">
          {chartData.length} Districts
        </span>
      </div>

      <div className="h-60 w-full mt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No district data recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 30, bottom: 5 }}
            >
              <defs>
                <linearGradient id="districtGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="district"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }} />
              <Bar
                dataKey="count"
                fill="url(#districtGradient)"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>Highest concentration: <strong className="text-slate-800">{chartData[0]?.district || 'N/A'}</strong></span>
        <span>Count: <strong className="text-slate-800">{chartData[0]?.count || 0} assets</strong></span>
      </div>
    </div>
  );
}
