import { TrendingUp, TrendingDown } from 'lucide-react';
import { getCategoryClass, getScoreColor, getScoreBg } from '../../utils/helpers';
import CategoryBadge from '../common/CategoryBadge';
import { useStudentTopicMastery } from '../../controllers/studentController';

// Map section names → category for the badge
const SECTION_CATEGORY = {
  'Technical Skills':      'Technical',
  'Logical Reasoning':     'Aptitude',
  'Quantitative Aptitude': 'Aptitude',
  'Verbal Reasoning':      'Aptitude',
  'Analytical Thinking':   'Aptitude',
  'Communication':         'Communication',
  'Teamwork':              'Behavioral',
  'Emotional Stability':   'Behavioral',
  'Conscientiousness':     'Behavioral',
  'Learning Orientation':  'Behavioral',
};

// Transform raw API array → top skills with change calculation
const transformTopSkills = (data = []) => {
  // Group by section_name, sorted by date ascending
  const grouped = {};
  [...data]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .forEach(entry => {
      if (!grouped[entry.section_name]) grouped[entry.section_name] = [];
      grouped[entry.section_name].push(parseFloat(entry.percentage_score));
    });

  // Build skill objects
  const skills = Object.entries(grouped).map(([name, scores]) => {
    const latest   = scores[scores.length - 1];
    const previous = scores.length > 1 ? scores[scores.length - 2] : latest;
    return {
      name,
      score:    Math.round(latest),
      change:   Math.round(latest - previous),
      category: SECTION_CATEGORY[name] ?? 'General',
    };
  });

  // Return top 6 by score descending
  return skills.sort((a, b) => b.score - a.score).slice(0, 6);
};

export default function TopSkillsList() {
  const { data: response, isLoading } = useStudentTopicMastery();

  const topSkills = transformTopSkills(response ?? [] );

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-base text-gray-800">Top Skills</h3>
        <button className="text-xs text-indigo-600 font-semibold hover:underline">View All →</button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 animate-pulse bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : !topSkills.length ? (
        <p className="text-sm text-gray-400 text-center py-8">No skill data yet</p>
      ) : (
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
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    skill.change >= 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {skill.change >= 0
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                  {skill.change >= 0 ? '+' : ''}{skill.change}pts
                </span>
                <span className={`stat-number text-base font-bold ${getScoreColor(skill.score)}`}>
                  {skill.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}