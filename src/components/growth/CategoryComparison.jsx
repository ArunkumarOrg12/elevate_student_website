import { useStudentComparison } from '../../controllers/studentController';

// Transform backend comparison response into [{ category, you, top10, batch }]
function transformComparison(apiData) {
  if (!apiData) return null;
  // Already in correct format
  if (Array.isArray(apiData) && apiData[0]?.category !== undefined && apiData[0]?.you !== undefined) return apiData;
  // Array with different field names
  if (Array.isArray(apiData) && apiData.length > 0) {
    return apiData.map(d => ({
      category: d.category ?? d.section ?? d.name,
      you:      Math.round(parseFloat(d.you ?? d.student_score ?? d.score ?? 0)),
      top10:    Math.round(parseFloat(d.top10 ?? d.top_percentile ?? d.top_10 ?? 0)),
      batch:    Math.round(parseFloat(d.batch ?? d.batch_average ?? d.avg ?? 0)),
    }));
  }
  // Object with category arrays
  if (apiData.categories) {
    return apiData.categories.map(d => ({
      category: d.category ?? d.name,
      you:      Math.round(parseFloat(d.student_score ?? 0)),
      top10:    Math.round(parseFloat(d.top_percentile ?? 0)),
      batch:    Math.round(parseFloat(d.batch_average ?? 0)),
    }));
  }
  return null;
}

export default function CategoryComparison() {
  const { data: comparisonRes, isLoading, isError } = useStudentComparison();

  if (isLoading) {
    return <div className="card p-6 h-[280px] animate-pulse bg-gray-50" />;
  }

  const categoryComparison = transformComparison(comparisonRes);

  if (isError || !categoryComparison) {
    return (
      <div className="card p-6 h-[280px] flex items-center justify-center text-sm text-gray-400">
        Comparison data unavailable
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Category Comparison</h3>
      <p className="text-xs text-gray-400 mb-4">You vs Top 10% vs Batch</p>

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
              { label: 'You',     value: row.you,   color: 'bg-blue-500' },
              { label: 'Top 10%', value: row.top10, color: 'bg-emerald-500' },
              { label: 'Batch',   value: row.batch,  color: 'bg-gray-300' },
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
