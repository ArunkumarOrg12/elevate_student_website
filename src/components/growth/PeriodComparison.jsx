import { periodComparison } from '../../data/mockData';
import { getScoreBg } from '../../utils/helpers';

const CATS = ['Overall', 'Aptitude', 'Technical', 'Behavioral', 'Communication'];

export default function PeriodComparison() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Period-over-Period</h3>
      <p className="text-xs text-gray-400 mb-5">Score comparison across key periods</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {periodComparison.map(period => (
          <div
            key={period.label}
            className={`rounded-xl p-4 border ${period.current ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-100 bg-gray-50/50'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-bold text-sm text-gray-900">{period.label}</p>
                <p className="text-xs text-gray-400">{period.date}</p>
              </div>
              {period.current && (
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Current</span>
              )}
            </div>
            <div className="space-y-2">
              {CATS.map(cat => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{cat}</span>
                    <span className="font-semibold text-gray-800">{period.scores[cat]}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${period.current ? getScoreBg(period.scores[cat]) : 'bg-gray-400'} transition-all duration-700`}
                      style={{ width: `${period.scores[cat]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
