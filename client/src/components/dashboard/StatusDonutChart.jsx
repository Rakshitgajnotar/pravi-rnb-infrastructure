import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const STATUS_COLORS = {
  Active: '#10b981',             // emerald-500
  'Under Maintenance': '#f59e0b', // amber-500
  'Under Construction': '#6366f1',// indigo-500
  Closed: '#f43f5e',             // rose-500
  Retired: '#64748b',            // slate-500
};

export default function StatusDonutChart({ data = [], totalAssets = 0 }) {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Active', value: 0, color: '#10b981' },
    { name: 'Under Maintenance', value: 0, color: '#f59e0b' },
    { name: 'Under Construction', value: 0, color: '#6366f1' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percent = totalAssets > 0 ? Math.round((item.value / totalAssets) * 100) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="flex items-center gap-2 font-semibold">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.payload.color || STATUS_COLORS[item.name] || '#6366f1' }}
            />
            {item.name}
          </div>
          <div className="text-slate-300">
            {item.value} Assets ({percent}%)
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
          <h3 className="text-base font-bold text-slate-900">Operational Status Distribution</h3>
          <p className="text-xs text-slate-500">Fleet readiness and execution status</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
          {totalAssets} Total
        </span>
      </div>

      <div className="relative h-60 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || STATUS_COLORS[entry.name] || '#6366f1'}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{totalAssets}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Assets</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 mt-2">
        {chartData.map((entry) => {
          const percent = totalAssets > 0 ? Math.round((entry.value / totalAssets) * 100) : 0;
          return (
            <div key={entry.name} className="flex flex-col p-2 rounded-xl bg-slate-50 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium mb-0.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color || STATUS_COLORS[entry.name] || '#6366f1' }}
                />
                <span className="truncate">{entry.name}</span>
              </div>
              <div className="text-sm font-bold text-slate-900">
                {entry.value} <span className="text-[10px] font-normal text-slate-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
