import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Code2, Users, MessageSquare, Clock, CircleDot, Flag } from 'lucide-react';
import { useAssessmentFlow } from '../context/AssessmentFlowContext';

const categoryIcons = {
  Aptitude:      BarChart3,
  Technical:     Code2,
  Behavioral:    Users,
  Communication: MessageSquare,
};

const categoryBadge = {
  Aptitude:      'badge-aptitude',
  Technical:     'badge-technical',
  Behavioral:    'badge-behavioral',
  Communication: 'badge-communication',
};

export default function AssessmentOverview() {
  const navigate = useNavigate();
  const { flow } = useAssessmentFlow();
  const { examConfig } = flow;

  useEffect(() => {
    if (!examConfig) navigate('/assessment/register');
  }, [examConfig, navigate]);

  if (!examConfig) return null;

  const Icon = categoryIcons[examConfig.category] || BarChart3;
  const badge = categoryBadge[examConfig.category] || 'badge-aptitude';

  return (
    <div className="page-enter min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 py-10">
      <div className="card w-full max-w-2xl p-8 space-y-6">

        {/* Category Icon */}
        <div className="flex justify-center">
          <div className="bg-indigo-100 text-indigo-600 w-14 h-14 rounded-full flex items-center justify-center">
            <Icon style={{ width: 26, height: 26 }} />
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-2xl text-gray-900">{examConfig.title}</h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">{examConfig.description}</p>
        </div>

        {/* Stats Row */}
        <div className="bg-gray-50 rounded-xl p-5 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
            <Clock style={{ width: 18, height: 18 }} className="text-indigo-500 mb-1" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</p>
            <p className="stat-number text-2xl text-gray-900">
              {examConfig.duration} <span className="text-sm font-medium text-gray-500">min</span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-white rounded-xl border border-gray-100">
            <CircleDot style={{ width: 18, height: 18 }} className="text-indigo-500 mb-1" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Questions</p>
            <p className="stat-number text-2xl text-gray-900">{examConfig.totalQuestions}</p>
          </div>
        </div>

        {/* Topics Covered */}
        <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/30">
          <p className="font-semibold text-gray-800 text-sm mb-3">Topics Covered</p>
          <div className="flex flex-wrap gap-2">
            {examConfig.topics.map(t => (
              <span key={t} className={badge}>{t}</span>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Flag style={{ width: 15, height: 15 }} className="text-amber-600" />
            <p className="font-semibold text-amber-800 text-sm">Instructions</p>
          </div>
          <ul className="space-y-1.5">
            {examConfig.instructions.map((ins, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {ins}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/assessment/security-check')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-[9px] transition-all duration-200 text-sm flex items-center justify-center gap-2"
        >
          Proceed to Security Check →
        </button>
      </div>
    </div>
  );
}
