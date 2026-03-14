import {
  RadarChart as ReRadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import { radarData } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}: <b>{p.value}</b></span>
        </div>
      ))}
    </div>
  );
};

export default function RadarChartComp() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Skill Radar</h3>
      <p className="text-xs text-gray-400 mb-5">You vs Batch Average</p>
      <ResponsiveContainer width="100%" height={280}>
        <ReRadarChart data={radarData} outerRadius="70%">
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11, fill: '#64748B' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Your Score" dataKey="you"  stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} strokeWidth={2} />
          <Radar name="Batch Avg"  dataKey="batch" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1}  strokeWidth={1.5} strokeDasharray="4 3" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
