import FrequencyChart from '../components/growth/FrequencyChart';
import CategoryComparison from '../components/growth/CategoryComparison';
import PeriodComparison from '../components/growth/PeriodComparison';
import ProgressTimeline from '../components/dashboard/ProgressTimeline';

export default function GrowthTimeline() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-gray-900">Growth Timeline</h2>
        <p className="text-gray-500 text-sm mt-1">Track your academic journey and improvement velocity across all semesters</p>
      </div>

      <ProgressTimeline />

      <div className="grid lg:grid-cols-2 gap-5">
        <FrequencyChart />
        <CategoryComparison />
      </div>

      <PeriodComparison />
    </div>
  );
}
