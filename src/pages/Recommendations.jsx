import { ClipboardList, CheckSquare } from 'lucide-react';
import ActionItemCard from '../components/recommendations/ActionItemCard';
import QuickWinsSidebar from '../components/recommendations/QuickWinsSidebar';
import { recommendations } from '../data/mockData';

export default function Recommendations() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-gray-900">Personalized Recommendations</h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-curated action plan based on your psychometric profile and target score gap
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary">
            <ClipboardList className="w-4 h-4" /> Take Assessment
          </button>
          <button className="btn-secondary">
            <CheckSquare className="w-4 h-4" /> Mark Complete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Action items */}
        <div className="space-y-4">
          {recommendations.map((r, i) => (
            <ActionItemCard key={r.id} action={r} delay={i * 80} />
          ))}
        </div>

        {/* Quick wins sidebar */}
        <QuickWinsSidebar />
      </div>
    </div>
  );
}
