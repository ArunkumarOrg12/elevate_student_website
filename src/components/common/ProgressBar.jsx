import { getScoreBg } from '../../utils/helpers';

export default function ProgressBar({ value, max = 100, colorClass, height = 'h-2', animated = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const bg = colorClass || getScoreBg(value);

  return (
    <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
      <div
        className={`${height} rounded-full ${bg} ${animated ? 'progress-fill' : ''} transition-all duration-700`}
        style={{ '--target-width': `${pct}%`, width: animated ? undefined : `${pct}%` }}
      />
    </div>
  );
}
