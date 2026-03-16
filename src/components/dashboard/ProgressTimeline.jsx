import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { getCategoryColor } from '../../utils/helpers';
import TabGroup from '../common/TabGroup';
import { useStudentTimeline } from '../../controllers/studentController';

const LINES = ['Overall', 'Technical', 'Aptitude', 'Soft Skills', 'Communication'];

// Transform API response → Recharts format
const transformTimeline = (data = []) =>
  data.map((entry, i) => ({
    semester: new Date(entry.calculated_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    Overall:       parseFloat(entry.overall_index),
    Technical:     parseFloat(entry.technical_score),
    Aptitude:      parseFloat(entry.aptitude_score),
    'Soft Skills': parseFloat(entry.soft_skills_score),
    Communication: parseFloat(entry.communication_score),
  }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ProgressTimeline() {
  const [view, setView] = useState('All Sections');
  const { data: raw, isLoading } = useStudentTimeline();

  const chartData = transformTimeline(raw ?? []);
  const lines = view === 'All Sections' ? LINES : ['Overall'];

  return (
    <div className="card p-6 flex-1">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="font-display font-semibold text-base text-gray-800">Progress Timeline</h3>
          <p className="text-xs text-gray-400 mt-0.5">Score trends across assessments</p>
        </div>
        <TabGroup
          tabs={['All Sections', 'Overall']}
          active={view}
          onChange={setView}
          size="sm"
        />
      </div>

      {isLoading ? (
        <div className="h-60 animate-pulse bg-gray-100 rounded-xl" />
      ) : !chartData.length ? (
        <div className="h-60 flex items-center justify-center text-sm text-gray-400">
          No timeline data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis
              dataKey="semester"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[30, 100]}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
            {lines.map(k => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={getCategoryColor(k)}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 0, fill: getCategoryColor(k) }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}