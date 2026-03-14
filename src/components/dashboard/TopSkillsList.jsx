import { TrendingUp, TrendingDown } from 'lucide-react';
import { topSkills } from '../../data/mockData';
import { getCategoryClass, getScoreColor, getScoreBg } from '../../utils/helpers';
import CategoryBadge from '../common/CategoryBadge';

export default function TopSkillsList() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-base text-gray-800">Top Skills</h3>
        <button className="text-xs text-indigo-600 font-semibold hover:underline">View All →</button>
      </div>
      <div className="space-y-4">
        {topSkills.map((skill, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-sm font-medium text-gray-800 truncate">{skill.name}</span>
                <CategoryBadge category={skill.category} />
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${getScoreBg(skill.score)} transition-all duration-700`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 text-right">
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${skill.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
              >
                {skill.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {skill.change >= 0 ? '+' : ''}{skill.change}pts
              </span>
              <span className={`stat-number text-base font-bold ${getScoreColor(skill.score)}`}>{skill.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
