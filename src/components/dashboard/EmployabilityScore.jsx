import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SCORE = 78;
const data = [{ value: SCORE }, { value: 100 - SCORE }];
const COLORS = ['#14B8A6', '#E2E8F0'];

function ScoreRing() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={84}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="stat-number text-4xl text-gray-900">{SCORE}</span>
        <span className="text-xs text-gray-400 font-semibold">/ 100</span>
      </div>
    </div>
  );
}

export default function EmployabilityScore() {
  return (
    <div className="card p-6 flex flex-col items-center">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Employability Index</h3>
      <p className="text-xs text-gray-400 mb-5 text-center uppercase tracking-wide font-semibold">Overall Score</p>

      <ScoreRing />

      <div className="mt-5 grid grid-cols-2 gap-4 w-full border-t border-gray-100 pt-4">
        <div className="text-center">
          <p className="stat-number text-xl text-indigo-600">82<span className="text-sm">th</span></p>
          <p className="text-xs text-gray-500 font-medium">Percentile Rank</p>
        </div>
        <div className="text-center border-l border-gray-100">
          <p className="stat-number text-xl text-emerald-600">+4.2</p>
          <p className="text-xs text-gray-500 font-medium">Growth/Sem</p>
        </div>
      </div>
    </div>
  );
}
