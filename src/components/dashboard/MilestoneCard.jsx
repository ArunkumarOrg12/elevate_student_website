import { Lock, Target } from 'lucide-react';
import { milestone } from '../../data/mockData';

export default function MilestoneCard() {
  const pct = Math.round((milestone.current / milestone.target) * 100);
  return (
    <div className="card p-5 border-l-4 border-l-amber-400">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <Lock className="w-4 h-4 text-amber-500" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">
          Locked
        </span>
      </div>
      <h4 className="font-display font-semibold text-sm text-gray-800 mb-1">Next Milestone</h4>
      <p className="text-sm font-semibold text-gray-900 mb-1">{milestone.title}</p>
      <p className="text-xs text-gray-500 mb-4">
        {milestone.description} (currently {milestone.current})
      </p>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5 overflow-hidden">
        <div
          className="h-2 rounded-full bg-amber-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 font-medium">
        <span>{milestone.current}/100</span>
        <span>Target: {milestone.target}+</span>
      </div>
    </div>
  );
}
