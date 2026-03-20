import { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { useStudentImprovementPlan } from '../../controllers/studentController';
import { roadmapActions as mockRoadmapActions } from '../../data/mockData';
import TabGroup from '../common/TabGroup';
import CategoryBadge from '../common/CategoryBadge';
import PriorityBadge from '../common/PriorityBadge';

const STATUS_ICON = {
  done:        <Check className="w-4 h-4 text-white" />,
  'in-progress': <Clock className="w-4 h-4 text-white" />,
  completed:   <Check className="w-4 h-4 text-white" />,
  pending:     null,
};
const STATUS_BG = {
  done:          'bg-emerald-500',
  'in-progress': 'bg-blue-500',
  completed:     'bg-emerald-500',
  pending:       'bg-gray-200',
};

// Transform backend improvement-plan response into the { '30': [...], '60': [...], '90': [...] } shape.
function transformPlan(apiData) {
  if (!apiData) return null;
  // Already in { '30': [...], '60': [...], '90': [...] } format
  if (apiData['30'] || apiData['60'] || apiData['90']) return apiData;
  // Array of actions with a `days` field
  if (Array.isArray(apiData) && apiData.length > 0) {
    const grouped = { '30': [], '60': [], '90': [] };
    apiData.forEach(a => {
      const key = a.days <= 30 ? '30' : a.days <= 60 ? '60' : '90';
      grouped[key].push({
        id:       a.id,
        title:    a.title ?? a.action_title,
        category: a.category ?? a.section,
        priority: a.priority,
        status:   a.status ?? 'pending',
      });
    });
    return grouped;
  }
  return null;
}

export default function ImprovementRoadmap() {
  const [plan, setPlan] = useState('30');
  const { data: planRes, isLoading } = useStudentImprovementPlan();

  const roadmapActions = transformPlan(planRes) ?? mockRoadmapActions;
  const actions = roadmapActions[plan] || [];
  const done = actions.filter(a => a.status === 'done' || a.status === 'completed').length;

  if (isLoading) {
    return <div className="card p-6 h-48 animate-pulse bg-gray-50" />;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-gray-800">Improvement Roadmap</h3>
          <p className="text-xs text-gray-400 mt-0.5">Structured 30/60/90-day action plan</p>
        </div>
        <TabGroup tabs={['30', '60', '90']} active={plan} onChange={setPlan} size="sm" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: actions.length ? `${(done / actions.length) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{done}/{actions.length} done</span>
      </div>

      <div className="space-y-3">
        {actions.map(a => (
          <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${STATUS_BG[a.status] ?? 'bg-gray-200'}`}>
              {STATUS_ICON[a.status] ?? null}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${(a.status === 'done' || a.status === 'completed') ? 'line-through text-gray-400' : 'text-gray-800'}`}>
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
