import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowUpRight, Zap, Clock } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import PriorityBadge from '../common/PriorityBadge';

export default function ActionItemCard({ action, delay = 0 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card p-5 hover-lift animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start gap-3 flex-wrap">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <PriorityBadge priority={action.priority} />
            <CategoryBadge category={action.category} />
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Clock className="w-3 h-3" />{action.days} days
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              action.effort === 'High' ? 'bg-red-50 text-red-600' : action.effort === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {action.effort} Effort
            </span>
          </div>
          <h4 className="font-display font-semibold text-gray-900 mb-1.5">{action.title}</h4>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">{action.description}</p>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" />↗ {action.points} points expected
            </div>
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
            >
              {expanded ? 'Collapse' : 'View steps'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          {expanded && action.steps && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Action Steps</p>
              <ol className="space-y-2">
                {action.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
