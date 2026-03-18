import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Hash, Clock4, FileText, Trophy, Loader2 } from 'lucide-react';
import { useAssessmentFlow } from '../context/AssessmentFlowContext';
import { useAttemptResults } from '../controllers/assessmentsController';

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDate(ts) {
  if (!ts) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AssessmentComplete() {
  const navigate = useNavigate();
  const { flow } = useAssessmentFlow();
  const { examConfig, answers, startTime, isSubmitted, attemptId, submitResult } = flow;

  // Poll for results from API; falls back to submitResult already stored in context
  const { data: apiResults, isLoading: resultsLoading } = useAttemptResults(attemptId);
  const results = apiResults || submitResult;

  useEffect(() => {
    if (!isSubmitted) navigate('/assessments');
  }, [isSubmitted, navigate]);

  if (!isSubmitted) return null;

  const attempted  = Object.keys(answers || {}).length;
  const totalQ     = examConfig?.totalQuestions || results?.totalQuestions || attempted;
  const elapsed    = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const duration   = examConfig ? (examConfig.duration_minutes || examConfig.duration || 60) * 60 : 0;
  const timeTaken  = Math.min(elapsed, duration);

  // Backend returns: { composite_score: { percentage_score, total_score, max_score }, answers_breakdown: [...] }
  const compositeScore = results?.composite_score ?? results;
  const score = compositeScore?.percentage_score != null
    ? Math.round(compositeScore.percentage_score)
    : (results?.score ?? results?.percentage ?? null);
  const answersBreakdown = results?.answers_breakdown ?? [];
  const correct = answersBreakdown.length > 0
    ? answersBreakdown.filter(a => a.is_correct).length
    : (results?.correctCount ?? results?.correct ?? null);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <style>{`
        @keyframes circleIn {
          0%   { stroke-dashoffset: 150; opacity: 0; }
          60%  { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes checkIn {
          0%   { stroke-dashoffset: 40; opacity: 0; }
          50%  { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0.4); opacity: 0; }
          50%  { transform: scale(1.12); }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes completeFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .complete-enter {
          animation: completeFadeIn 0.5s 0.2s ease-out both;
        }
        .check-icon-bounce {
          animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .circle-draw {
          stroke-dasharray: 150;
          animation: circleIn 0.7s ease-out forwards;
        }
        .check-draw {
          stroke-dasharray: 40;
          animation: checkIn 0.4s 0.5s ease-out both;
        }
      `}</style>

      <div className="w-full max-w-md space-y-6">
        {/* Animated Checkmark */}
        <div className="flex justify-center">
          <div className="check-icon-bounce">
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
              <circle cx="44" cy="44" r="40" fill="#DCFCE7" />
              <circle
                cx="44" cy="44" r="36"
                stroke="#10B981"
                strokeWidth="3.5"
                fill="none"
                className="circle-draw"
                strokeLinecap="round"
              />
              <polyline
                points="28,44 40,56 62,32"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="check-draw"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="complete-enter text-center space-y-2">
          <h1 className="font-display font-bold text-2xl text-gray-900">Assessment Submitted Successfully!</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Your responses have been recorded. Results will be available after evaluation.
          </p>
        </div>

        {/* Score Card — shown when results available */}
        {resultsLoading && (
          <div className="complete-enter flex items-center justify-center gap-2 text-gray-500 text-sm" style={{ animationDelay: '0.25s' }}>
            <Loader2 style={{ width: 16, height: 16 }} className="animate-spin text-indigo-500" />
            Fetching your results…
          </div>
        )}
        {score != null && (
          <div className="complete-enter card p-5 flex items-center justify-between" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Trophy style={{ width: 18, height: 18 }} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Score</p>
                {correct != null && (
                  <p className="text-xs text-gray-500 mt-0.5">{correct} of {totalQ} correct</p>
                )}
              </div>
            </div>
            <p className="stat-number text-3xl text-indigo-600">{score}%</p>
          </div>
        )}

        {/* Summary Card */}
        <div className="complete-enter card p-6 space-y-4" style={{ animationDelay: '0.35s' }}>
          <div className="flex items-center gap-2 mb-1">
            <FileText style={{ width: 16, height: 16 }} className="text-indigo-500" />
            <p className="font-semibold text-gray-800 text-sm">{examConfig?.title || 'Assessment'}</p>
          </div>
          <div className="h-px bg-gray-100" />

          <div className="space-y-3">
            <SummaryRow icon={Hash}     label="Questions Attempted" value={`${attempted} / ${totalQ}`} />
            <SummaryRow icon={Clock4}   label="Time Taken"          value={formatTime(timeTaken)} />
            <SummaryRow icon={Calendar} label="Submitted On"        value={formatDate(startTime)} />
          </div>
        </div>

        {/* CTAs */}
        <div className="complete-enter flex gap-3" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={() => navigate('/assessments')}
            className="flex-1 btn-secondary justify-center"
          >
            My Assessments
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-[9px] transition-all duration-200 text-sm"
          >
            Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
          <Icon style={{ width: 13, height: 13 }} className="text-gray-400" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="stat-number text-sm text-gray-900">{value}</span>
    </div>
  );
}
