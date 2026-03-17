import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useStudentTimeline, useStudentPeerBenchmark } from '../../controllers/studentController';

const COLORS = ['#14B8A6', '#E2E8F0'];

function ScoreRing({ score }) {
  const ringData = [{ value: score }, { value: 100 - score }];
  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={ringData}
            cx="50%" cy="50%"
            innerRadius={68} outerRadius={84}
            startAngle={90} endAngle={-270}
            dataKey="value" strokeWidth={0}
          >
            {ringData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="stat-number text-4xl text-gray-900">{score}</span>
        <span className="text-xs text-gray-400 font-semibold">/ 100</span>
      </div>
    </div>
  );
}

export default function EmployabilityScore() {
 const { data: timeline,  isLoading } = useStudentTimeline();
const { data: benchmark            } = useStudentPeerBenchmark();
// benchmark = { student_score, batch_average, top_percentile } directly
const tl         = timeline  ?? [];
const latest     = tl[tl.length - 1];
const previous   = tl[tl.length - 2];
const score      = latest ? Math.round(parseFloat(latest.overall_index)) : 0;
const growth     = latest && previous
  ? `+${(parseFloat(latest.overall_index) - parseFloat(previous.overall_index)).toFixed(1)}`
  : '—';
const percentile = benchmark?.top_percentile
  ? Math.round(parseFloat(benchmark.top_percentile)) : '—';

  if (isLoading) {
    return <div className="card p-6 flex items-center justify-center h-64 animate-pulse bg-gray-50" />;
  }

  return (
    <div className="card p-6 flex flex-col items-center">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Employability Index</h3>
      <p className="text-xs text-gray-400 mb-5 text-center uppercase tracking-wide font-semibold">Overall Score</p>

      <ScoreRing score={score} />

      <div className="mt-5 grid grid-cols-2 gap-4 w-full border-t border-gray-100 pt-4">
        <div className="text-center">
          <p className="stat-number text-xl text-indigo-600">
            {percentile}<span className="text-sm">th</span>
          </p>
          <p className="text-xs text-gray-500 font-medium">Percentile Rank</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="stat-number text-xl text-emerald-600">{growth}</p>
          <p className="text-xs text-gray-500 font-medium">Growth/Entry</p>
        </div>
      </div>
    </div>
  );
}