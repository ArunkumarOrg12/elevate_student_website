import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { assessmentFrequency } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-indigo-600 font-bold">{payload[0].value} assessments</p>
    </div>
  );
};

export default function FrequencyChart() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Assessment Frequency</h3>
      <p className="text-xs text-gray-400 mb-5">Assessments taken per semester</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={assessmentFrequency} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 7]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={40}>
            {assessmentFrequency.map((_, i) => (
              <Cell key={i} fill={i === assessmentFrequency.length - 1 ? '#6366F1' : '#C7D2FE'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
