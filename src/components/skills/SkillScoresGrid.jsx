import { individualSkills } from '../../data/mockData';
import { getScoreColor, getScoreBg } from '../../utils/helpers';

export default function SkillScoresGrid() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-4">Individual Skill Scores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {individualSkills.map((s, i) => (
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
