import RadarChartComp from '../components/skills/RadarChart';
import SkillHeatmap from '../components/skills/SkillHeatmap';
import InsightCard from '../components/skills/InsightCard';
import SkillScoresGrid from '../components/skills/SkillScoresGrid';
import ImprovementRoadmap from '../components/skills/ImprovementRoadmap';

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
    </div>
  );
}
