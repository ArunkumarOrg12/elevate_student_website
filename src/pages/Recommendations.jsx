import { ClipboardList, CheckSquare } from 'lucide-react';
import ActionItemCard from '../components/recommendations/ActionItemCard';
import QuickWinsSidebar from '../components/recommendations/QuickWinsSidebar';
import { useStudentRecommendations } from '../controllers/studentController';
import { recommendations as mockRecommendations } from '../data/mockData';

// Normalize backend recommendations to the shape ActionItemCard expects.
function normalizeRecommendations(apiData) {
  if (!Array.isArray(apiData) || apiData.length === 0) return null;
  return apiData.map((r, i) => ({
    id:          r.id ?? i,
    priority:    r.priority,
    category:    r.category ?? r.section,
    title:       r.title ?? r.recommendation_title,
    description: r.description ?? r.details ?? '',
    effort:      r.effort ?? r.effort_level,
    timeframe:   r.timeframe ?? r.timeline,
  }));
}

export default function Recommendations() {
  const { data: recsRes, isLoading } = useStudentRecommendations();

  const recommendations = normalizeRecommendations(recsRes) ?? mockRecommendations;

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

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-32 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-4">
            {recommendations.map((r, i) => (
              <ActionItemCard key={r.id} action={r} delay={i * 80} />
            ))}
          </div>
          <QuickWinsSidebar />
        </div>
      )}
    </div>
  );
}
