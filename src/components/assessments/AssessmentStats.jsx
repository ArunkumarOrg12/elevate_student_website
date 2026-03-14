import { assessmentStats } from '../../data/mockData';

const cards = [
  { label: 'Average Score', value: assessmentStats.average, unit: '/100', color: 'text-blue-600' },
  { label: 'Best Score',    value: assessmentStats.best,    unit: '/100', color: 'text-emerald-600' },
  { label: 'Avg Percentile',value: `${assessmentStats.avgPercentile}th`, unit: '', color: 'text-indigo-600' },
  { label: 'Improvement Rate', value: assessmentStats.improvementRate, unit: ' pts avg', color: 'text-violet-600' },
];

export default function AssessmentStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="card p-4 text-center">
          <p className={`stat-number text-2xl ${c.color}`}>{c.value}<span className="text-sm text-gray-400 font-medium">{c.unit}</span></p>
          <p className="text-xs text-gray-500 font-medium mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
