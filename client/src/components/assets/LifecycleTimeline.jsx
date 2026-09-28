import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  History,
  ArrowRight,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ConditionBadge from '../common/ConditionBadge';

const actionIcons = {
  'Asset Registered': CheckCircle2,
  'Status Changed': Activity,
  'Condition Changed': AlertTriangle,
  'Inspection Added': Calendar,
  'Maintenance Started': Wrench,
  'Maintenance Completed': CheckCircle2,
  'Maintenance Scheduled': Clock,
  'Asset Updated': History,
};

export default function LifecycleTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700">No Lifecycle Events Recorded</h4>
        <p className="text-xs text-slate-400 mt-1">
          Historical changes, inspections, and maintenance events will appear here in chronological order.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((event, index) => {
        const Icon = actionIcons[event.action] || Activity;
        const isLatest = index === 0;

        return (
          <div key={event._id || index} className="relative group">
            {/* Dot Indicator */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                isLatest
                  ? 'border-brand-600 bg-brand-50 text-brand-600 ring-4 ring-brand-100'
                  : 'border-slate-300 text-slate-400 group-hover:border-brand-500'
              }`}
            >
              <Icon className="w-2.5 h-2.5" />
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{event.action}</span>
                  {isLatest && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200">
                      Latest Event
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }) : 'N/A'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3 h-3 text-slate-400" />
                    {event.performedBy || 'System User'}
                  </span>
                </div>
              </div>

              {/* Transition values badge if previous -> new */}
              {(event.previousValue || event.newValue) && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  {event.previousValue && (
                    <>
                      <span className="text-slate-500 line-through font-medium">
                        {event.previousValue}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </>
                  )}
                  <span className="font-bold text-slate-800">
                    {event.newValue}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
