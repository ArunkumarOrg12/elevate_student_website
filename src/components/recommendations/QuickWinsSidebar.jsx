import { useState } from 'react';
import { Check } from 'lucide-react';
import { quickWins, proTips } from '../../data/mockData';
import TabGroup from '../common/TabGroup';
import CategoryBadge from '../common/CategoryBadge';
import ProTipCard from './ProTipCard';

const STATUS_STYLE = {
  done:    'bg-emerald-500 text-white',
  active:  'bg-blue-500 text-white',
  pending: 'bg-gray-200 text-gray-400',
};

export default function QuickWinsSidebar() {
  const [plan, setPlan] = useState('30');
  const wins = quickWins[plan] || [];
  const done = wins.filter(w => w.status === 'done').length;

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-base text-gray-800">Quick Wins</h3>
        <TabGroup tabs={['30', '60', '90']} active={plan} onChange={setPlan} size="sm" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Communication Focus</p>
        <p className="text-xs text-gray-400 mt-0.5">{wins.length} actions · {done} completed</p>
      </div>
      <ol className="space-y-3">
        {wins.map((w, i) => (
          <li key={w.id} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${STATUS_STYLE[w.status]}`}>
              {w.status === 'done' ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${w.status === 'done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{w.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge category={w.category} />
                <span className={`text-xs font-semibold capitalize ${
                  w.status === 'done' ? 'text-emerald-600' : w.status === 'active' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {w.status === 'active' ? 'Active' : w.status === 'done' ? 'Done' : 'Pending'}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <ProTipCard tip={proTips[plan]} />
    </div>
  );
}
