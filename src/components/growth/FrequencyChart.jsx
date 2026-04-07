import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useStudentAssessmentHistory } from '../../controllers/studentController';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-indigo-600 font-bold">{payload[0].value} assessments</p>
    </div>
  );
};

// Group assessment history records by semester label and count.
function deriveFrequency(apiData) {
  if (!Array.isArray(apiData) || apiData.length === 0) return null;
  // If already in { semester, count } format
  if (apiData[0].semester !== undefined && apiData[0].count !== undefined) return apiData;
  // Group by semester_label or derive from created_at
  const counts = {};
  apiData.forEach(a => {
    const key = a.semester_label ?? a.cycle_label ?? a.semester ??
      (a.created_at ? `Sem ${new Date(a.created_at).getFullYear()}` : 'Unknown');
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.entries(counts).map(([semester, count]) => ({ semester, count }));
}

export default function FrequencyChart() {
  const { data: historyRes, isLoading, isError } = useStudentAssessmentHistory();

  if (isLoading) {
    return <div className="card p-6 h-[280px] animate-pulse bg-gray-50" />;
  }

  const chartData = deriveFrequency(historyRes);

  if (isError || !chartData) {
    return (
      <div className="card p-6 h-[280px] flex items-center justify-center text-sm text-gray-400">
        No assessment history available
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Assessment Frequency</h3>
      <p className="text-xs text-gray-400 mb-5">Assessments taken per semester</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 'auto']} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={40}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === chartData.length - 1 ? '#6366F1' : '#C7D2FE'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
