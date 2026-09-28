import React from 'react';
import {
  Laptop,
  Monitor,
  Server,
  Network,
  Smartphone,
  Keyboard,
  Armchair,
  Tv,
  Box,
} from 'lucide-react';

const categoryIcons = {
  Laptops: Laptop,
  Monitors: Monitor,
  Servers: Server,
  Networking: Network,
  'Mobile Devices': Smartphone,
  Peripherals: Keyboard,
  Furniture: Armchair,
  'Audio/Video': Tv,
  Other: Box,
};

const categoryColors = {
  Laptops: 'bg-blue-50 text-blue-700 border-blue-200',
  Monitors: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Servers: 'bg-purple-50 text-purple-700 border-purple-200',
  Networking: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Mobile Devices': 'bg-pink-50 text-pink-700 border-pink-200',
  Peripherals: 'bg-teal-50 text-teal-700 border-teal-200',
  Furniture: 'bg-orange-50 text-orange-700 border-orange-200',
  'Audio/Video': 'bg-rose-50 text-rose-700 border-rose-200',
  Other: 'bg-gray-50 text-gray-700 border-gray-200',
};

export default function CategoryBadge({ category, showIcon = true, size = 'md' }) {
  const IconComponent = categoryIcons[category] || Box;
  const colorClass = categoryColors[category] || 'bg-slate-50 text-slate-700 border-slate-200';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${colorClass} ${sizeClasses}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{category}</span>
    </span>
  );
}
