import { useState } from 'react';
import { Check, Clock, Circle } from 'lucide-react';
import { roadmapActions } from '../../data/mockData';
import TabGroup from '../common/TabGroup';
import CategoryBadge from '../common/CategoryBadge';
import PriorityBadge from '../common/PriorityBadge';

const STATUS_ICON = {
  done: <Check className="w-4 h-4 text-white" />,
  'in-progress': <Clock className="w-4 h-4 text-white" />,
  pending: null,
};
const STATUS_BG = {
  done: 'bg-emerald-500',
  'in-progress': 'bg-blue-500',
  pending: 'bg-gray-200',
};

export default function ImprovementRoadmap() {
  const [plan, setPlan] = useState('30');

  const actions = roadmapActions[plan] || [];
  const done = actions.filter(a => a.status === 'done').length;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-gray-800">Improvement Roadmap</h3>
          <p className="text-xs text-gray-400 mt-0.5">Structured 30/60/90-day action plan</p>
        </div>
        <TabGroup tabs={['30', '60', '90']} active={plan} onChange={setPlan} size="sm" />
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${(done / actions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{done}/{actions.length} done</span>
      </div>

      <div className="space-y-3">
        {actions.map(a => (
          <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${STATUS_BG[a.status]}`}>
              {STATUS_ICON[a.status]}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${a.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {a.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <CategoryBadge category={a.category} />
                <PriorityBadge priority={a.priority} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
