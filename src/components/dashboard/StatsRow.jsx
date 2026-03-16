import { TrendingUp, Award, Rocket, ClipboardList, ShieldCheck } from 'lucide-react';
import StatCard from '../common/StatCard';
import { useStudentTimeline, useStudentPeerBenchmark, useStudentAssessmentHistory } from '../../controllers/studentController';

const ICONS = { TrendingUp, Award, Rocket, ClipboardList, ShieldCheck };

export default function StatsRow() {
  const { data: timelineRes } = useStudentTimeline();
  const { data: benchmarkRes } = useStudentPeerBenchmark();
  const { data: historyRes  } = useStudentAssessmentHistory();

  const timeline   = timelineRes ?? [];
  const benchmark  = benchmarkRes?? {};
  const history    = historyRes ?? [];

  // Latest overall index
  const latest   = timeline[timeline.length - 1];
  const previous = timeline[timeline.length - 2];
  const eiScore  = latest   ? Math.round(parseFloat(latest.overall_index))   : '—';
  const eiChange = latest && previous
    ? `${parseFloat(latest.overall_index) - parseFloat(previous.overall_index) >= 0 ? '+' : ''}${(parseFloat(latest.overall_index) - parseFloat(previous.overall_index)).toFixed(1)}pts`
    : '—';

  // Percentile from benchmark
  const percentile = benchmark.top_percentile ? Math.round(parseFloat(benchmark.top_percentile)) : '—';

  // Growth velocity: avg change per entry
  const velocity = timeline.length > 1
    ? ((parseFloat(timeline[timeline.length - 1].overall_index) - parseFloat(timeline[0].overall_index)) / (timeline.length - 1)).toFixed(1)
    : '—';

  const assessmentCount = history.length || '—';

  const stats = [
    { id: 1, label: 'Employability Index', value: String(eiScore),        unit: '/100',     change: eiChange,          up: true,  icon: 'TrendingUp'  },
    { id: 2, label: 'Percentile Rank',     value: String(percentile),     unit: 'th',       change: '',                up: true,  icon: 'Award'       },
    { id: 3, label: 'Growth Velocity',     value: velocity !== '—' ? `+${velocity}` : '—', unit: 'pts/entry', change: '', up: true, icon: 'Rocket' },
    { id: 4, label: 'Assessments Taken',   value: String(assessmentCount),unit: '',         change: '',                up: true,  icon: 'ClipboardList'},
    { id: 5, label: 'Risk Indicator',      value: eiScore >= 70 ? 'Low' : eiScore >= 50 ? 'Medium' : 'High', unit: '', change: '', up: eiScore >= 70, icon: 'ShieldCheck' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
      {stats.map((s, i) => (
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