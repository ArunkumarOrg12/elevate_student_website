import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, unit, change, up, icon: IconComp, delay = 0 }) {
  return (
    <div
      className="card p-5 min-w-[160px] flex-shrink-0 hover-lift animate-count-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          {IconComp && <IconComp className="w-4 h-4 text-indigo-600" />}
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
            up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}
        >
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <div className="stat-number text-2xl text-gray-900">
        {value}<span className="text-base text-gray-400 font-medium">{unit}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
    </div>
  );
}
