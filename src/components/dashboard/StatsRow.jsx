import { TrendingUp, Award, Rocket, ClipboardList, ShieldCheck } from 'lucide-react';
import StatCard from '../common/StatCard';
import { dashboardStats } from '../../data/mockData';

const ICONS = { TrendingUp, Award, Rocket, ClipboardList, ShieldCheck };

export default function StatsRow() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
      {dashboardStats.map((s, i) => (
        <StatCard
          key={s.id}
          label={s.label}
          value={s.value}
          unit={s.unit}
          change={s.change}
          up={s.up}
          icon={ICONS[s.icon]}
          delay={i * 80}
        />
      ))}
    </div>
  );
}
