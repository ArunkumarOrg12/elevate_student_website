import RadarChartComp from '../components/skills/RadarChart';
import SkillHeatmap from '../components/skills/SkillHeatmap';
import InsightCard from '../components/skills/InsightCard';
import SkillScoresGrid from '../components/skills/SkillScoresGrid';
import ImprovementRoadmap from '../components/skills/ImprovementRoadmap';
import { useStudentTopicMastery } from '../controllers/studentController';
import { getCategoryClass } from '../utils/helpers';

function WeakTopicsPanel() {
  const { data, isLoading } = useStudentTopicMastery();

  if (isLoading) {
    return (
      <div className="card p-6 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
      </div>
    );
  }

  const topicAnalysis = data?.topic_analysis ?? data;
  if (!topicAnalysis || Object.keys(topicAnalysis).length === 0) return null;

  // Collect all weak topics across all sections
  const weakTopics = [];
  Object.entries(topicAnalysis).forEach(([section, topics]) => {
    Object.entries(topics).forEach(([topicName, info]) => {
      if (info.weak) {
        weakTopics.push({ section, topicName, ...info });
      }
    });
  });

  return (
    <div className="card p-5 space-y-4">
      <div>
        <h3 className="font-display font-semibold text-base text-gray-800">Weak Topics</h3>
        <p className="text-xs text-gray-400 mt-0.5">Topics that need improvement based on your assessments</p>
      </div>
      <div className="h-px bg-gray-100" />

      {weakTopics.length === 0 ? (
        <div className="flex items-center gap-3 py-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-500 text-lg">✓</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">No weak topics identified. Keep it up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {weakTopics.map(({ section, topicName, score, recommendation }) => (
            <div key={`${section}-${topicName}`} className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`${getCategoryClass(section.charAt(0).toUpperCase() + section.slice(1))} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
                <span className="text-sm font-semibold text-gray-800">{topicName}</span>
                <span className="ml-auto text-xs font-bold text-red-500">
                  {score != null ? `Score: ${score}%` : '—'}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-400 transition-all duration-700"
                  style={{ width: `${score ?? 0}%` }}
                />
              </div>
              {recommendation && (
                <p className="text-xs text-gray-400 italic leading-relaxed">{recommendation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SkillInsights() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-gray-900">Skill Insights</h2>
        <p className="text-gray-500 text-sm mt-1">Deep dive into your competency profile across all dimensions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <RadarChartComp />
        <SkillHeatmap />
      </div>

      <InsightCard />
      <SkillScoresGrid />
      <ImprovementRoadmap />
      <WeakTopicsPanel />
    </div>
  );
}
