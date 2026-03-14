import { Calendar, Clock, BarChart2, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import CategoryBadge from '../common/CategoryBadge';
import { getScoreBg, getScoreColor, getCategoryInitial, getInitialColor } from '../../utils/helpers';

export default function AssessmentCard({ assessment, delay = 0 }) {
  const { title, category, attempt, date, duration, questions, prevScore, score, percentile, change } = assessment;
  const pct = score;

  return (
    <div
      className="card p-5 hover-lift animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start gap-4">
        {/* Category circle */}
        <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm ${getInitialColor(category)}`}>
          {getCategoryInitial(category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-semibold text-gray-900 text-sm">{title}</span>
              <CategoryBadge category={category} />
              <span className="text-xs text-gray-400 font-medium">Attempt #{attempt}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`flex items-center gap-1 text-xs font-bold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change >= 0 ? '+' : ''}{change}pts
              </span>
              <button className="flex items-center gap-1 text-xs text-indigo-600 font-semibold border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors">
                <RotateCcw className="w-3 h-3" /> Retest
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400 flex-wrap">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{duration}</span>
            <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{questions} questions</span>
          </div>

          {/* Score row */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium flex-shrink-0">Prev: {prevScore}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full ${getScoreBg(score)} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium flex-shrink-0">{percentile}th</span>
            <span className={`stat-number text-sm font-bold flex-shrink-0 ${getScoreColor(score)}`}>{score}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
