import { useStudentTopicMastery } from '../../controllers/studentController';
import { individualSkills as mockSkills } from '../../data/mockData';
import { getScoreColor } from '../../utils/helpers';

// Transform backend topic-mastery response: [{ section_name, percentage_score }]
function transformSkills(apiData) {
  if (!Array.isArray(apiData) || apiData.length === 0) return null;
  if (apiData[0].section_name !== undefined) {
    return apiData.map(d => ({
      name:  d.section_name,
      score: Math.round(parseFloat(d.percentage_score ?? 0)),
    }));
  }
  // Already in { name, score } format
  if (apiData[0].name !== undefined) return apiData;
  return null;
}

export default function SkillScoresGrid() {
  const { data: masteryRes, isLoading } = useStudentTopicMastery();

  const skills = transformSkills(masteryRes) ?? mockSkills;

  if (isLoading) {
    return <div className="card p-6 h-40 animate-pulse bg-gray-50" />;
  }

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-4">Individual Skill Scores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {skills.map((s, i) => (
          <div key={i} className="text-center group">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke={s.score >= 80 ? '#10B981' : s.score >= 70 ? '#3B82F6' : '#F59E0B'}
                  strokeWidth="3"
                  strokeDasharray={`${(s.score / 100) * 94.25} 94.25`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${getScoreColor(s.score)}`}>{s.score}</span>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 leading-tight">{s.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
