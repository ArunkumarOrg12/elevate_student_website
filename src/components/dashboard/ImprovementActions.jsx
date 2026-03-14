import { ArrowUpRight } from 'lucide-react';
import { improvementActions } from '../../data/mockData';
import CategoryBadge from '../common/CategoryBadge';
import PriorityBadge from '../common/PriorityBadge';

export default function ImprovementActions() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-base text-gray-800">Top Improvement Actions</h3>
          <p className="text-xs text-gray-400 mt-0.5">Personalized next steps to boost your score</p>
        </div>
        <button className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
          View Full Plan <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {improvementActions.map((action) => (
          <div
            key={action.id}
            className="border border-gray-100 rounded-xl p-4 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <PriorityBadge priority={action.priority} />
              <CategoryBadge category={action.category} />
            </div>
            <h4 className="font-semibold text-sm text-gray-800 mb-1.5 group-hover:text-indigo-700 transition-colors">
              {action.title}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
              {action.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
              <ArrowUpRight className="w-3 h-3" />
              ↗ {action.points} points expected
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
