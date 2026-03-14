import { categoryComparison } from '../../data/mockData';

export default function CategoryComparison() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Category Comparison</h3>
      <p className="text-xs text-gray-400 mb-4">You vs Top 10% vs Batch</p>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-5 text-xs font-medium">
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-blue-500 inline-block" />Your Score</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-emerald-500 inline-block" />Top 10%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-gray-300 inline-block" />Batch Avg</span>
      </div>

      <div className="space-y-5">
        {categoryComparison.map(row => (
          <div key={row.category}>
            <div className="flex justify-between text-xs font-medium text-gray-600 mb-2">
              <span>{row.category}</span>
            </div>
            {[
              { label: 'You', value: row.you,   color: 'bg-blue-500' },
              { label: 'Top 10%', value: row.top10, color: 'bg-emerald-500' },
              { label: 'Batch', value: row.batch,  color: 'bg-gray-300' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-2 rounded-full ${b.color} transition-all duration-700`} style={{ width: `${b.value}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-700 w-6 text-right">{b.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
