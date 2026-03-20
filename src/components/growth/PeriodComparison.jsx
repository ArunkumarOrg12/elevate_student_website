import { useStudentTimeline } from '../../controllers/studentController';
import { getScoreBg } from '../../utils/helpers';

const CATS = ['Overall', 'Aptitude', 'Technical', 'Behavioral', 'Communication'];

// Build period comparison from timeline data.
// Timeline returns [{ semester_label, overall_index, aptitude_score, technical_score, behavioral_score, communication_score }]
function derivePeriods(apiData) {
  if (!Array.isArray(apiData) || apiData.length === 0) return null;
  const tl = apiData;
  const pick = (entry) => ({
    Overall:       Math.round(parseFloat(entry.overall_index      ?? entry.Overall      ?? 0)),
    Aptitude:      Math.round(parseFloat(entry.aptitude_score     ?? entry.Aptitude     ?? 0)),
    Technical:     Math.round(parseFloat(entry.technical_score    ?? entry.Technical    ?? 0)),
    Behavioral:    Math.round(parseFloat(entry.behavioral_score   ?? entry.Behavioral   ?? 0)),
    Communication: Math.round(parseFloat(entry.communication_score ?? entry.Communication ?? 0)),
  });

  const periods = [];
  if (tl.length >= 3) {
    const start = tl[0];
    periods.push({
      label:   start.semester_label ?? start.semester ?? 'Start',
      date:    start.created_at ? new Date(start.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
      current: false,
      scores:  pick(start),
    });
    const mid = tl[Math.floor(tl.length / 2)];
    periods.push({
      label:   mid.semester_label ?? mid.semester ?? 'Mid',
      date:    mid.created_at ? new Date(mid.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
      current: false,
      scores:  pick(mid),
    });
  }
  const latest = tl[tl.length - 1];
  periods.push({
    label:   latest.semester_label ?? latest.semester ?? 'Current',
    date:    latest.created_at ? new Date(latest.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
    current: true,
    scores:  pick(latest),
  });
  return periods;
}

export default function PeriodComparison() {
  const { data: timelineRes, isLoading, isError } = useStudentTimeline();

  if (isLoading) {
    return <div className="card p-6 h-[280px] animate-pulse bg-gray-50" />;
  }

  const periodComparison = derivePeriods(timelineRes);

  if (isError || !periodComparison) {
    return (
      <div className="card p-6 h-[280px] flex items-center justify-center text-sm text-gray-400">
        No timeline data available
      </div>
    );
  }

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
