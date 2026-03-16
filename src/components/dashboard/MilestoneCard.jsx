import { Lock, Trophy } from 'lucide-react';
import { useStudentTimeline } from '../../controllers/studentController';

const MILESTONE_TARGET = 80;

export default function MilestoneCard() {
  const { data: timelineRes, isLoading } = useStudentTimeline();
  const timeline = timelineRes?.data ?? [];

const tl      = timeline ?? [];
const latest  = tl[tl.length - 1];
const current = latest ? Math.round(parseFloat(latest.overall_index)) : 0;
  const pct     = Math.min(Math.round((current / MILESTONE_TARGET) * 100), 100);
  const unlocked = current >= MILESTONE_TARGET;

  if (isLoading) {
    return <div className="card p-5 h-48 animate-pulse bg-gray-50" />;
  }

  return (
    <div className={`card p-5 border-l-4 ${unlocked ? 'border-l-emerald-400' : 'border-l-amber-400'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${unlocked ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          {unlocked
            ? <Trophy className="w-4 h-4 text-emerald-500" />
            : <Lock className="w-4 h-4 text-amber-500" />}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          unlocked
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
            : 'bg-amber-50 text-amber-600 border-amber-200'
        }`}>
          {unlocked ? 'Unlocked' : 'Locked'}
        </span>
      </div>
      <h4 className="font-display font-semibold text-sm text-gray-800 mb-1">Next Milestone</h4>
      <p className="text-sm font-semibold text-gray-900 mb-1">Employment Ready Badge</p>
      <p className="text-xs text-gray-500 mb-4">
        Score {MILESTONE_TARGET}+ Employability Index (currently {current})
      </p>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${unlocked ? 'bg-emerald-400' : 'bg-amber-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 font-medium">
        <span>{current}/100</span>
        <span>Target: {MILESTONE_TARGET}+</span>
      </div>
    </div>
  );
}