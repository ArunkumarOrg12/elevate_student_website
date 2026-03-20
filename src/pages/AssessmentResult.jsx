import { useParams, useNavigate } from 'react-router-dom';
import {
  Trophy, ChevronLeft, AlertCircle, Loader2,
  CheckCircle2, XCircle, MinusCircle, Clock4,
  BarChart3, FileText, Calendar, BookOpen,
} from 'lucide-react';
import { useAttemptResults } from '../controllers/assessmentsController';

const SECTION_LABELS = {
  aptitude_score:      { label: 'Aptitude',      weight: 30 },
  technical_score:     { label: 'Technical',     weight: 35 },
  behavioral_score:    { label: 'Behavioral',    weight: 20 },
  communication_score: { label: 'Communication', weight: 15 },
  // Handle if section_name already contains a display name
  Aptitude:      { label: 'Aptitude',      weight: 30 },
  Technical:     { label: 'Technical',     weight: 35 },
  Behavioral:    { label: 'Behavioral',    weight: 20 },
  'Soft Skills': { label: 'Behavioral',    weight: 20 },
  Communication: { label: 'Communication', weight: 15 },
};

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function scoreColor(pct) {
  if (pct == null) return '#6366F1';
  if (pct >= 75) return '#10B981';
  if (pct >= 50) return '#F59E0B';
  return '#EF4444';
}

function scoreLabel(pct) {
  if (pct == null) return 'Score Pending';
  if (pct >= 75) return 'Excellent Work!';
  if (pct >= 50) return 'Good Effort!';
  return 'Keep Practising!';
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AssessmentResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useAttemptResults(attemptId);

  return (
    <div className="page-enter p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/assessments')}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft style={{ width: 16, height: 16 }} />
        My Assessments
      </button>

      <div>
        <h2 className="font-display font-bold text-2xl text-gray-900">Assessment Result</h2>
        <p className="text-gray-500 text-sm mt-1">Your score and answer breakdown</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="card p-12 flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Fetching your results…</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
          <p className="font-semibold text-gray-700">Could not load results</p>
          <p className="text-sm text-gray-400">Check your connection and try again.</p>
          <div className="flex gap-2 mt-2">
            <button className="btn-secondary text-sm" onClick={() => refetch()}>Retry</button>
            <button className="btn-secondary text-sm" onClick={() => navigate('/assessments')}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* Pending — cycle not yet completed (202) */}
      {!isLoading && !isError && data?.result_available === false && (
        <PendingView
          message={data.message}
          attemptStatus={data.attempt_status}
          onBack={() => navigate('/assessments')}
        />
      )}

      {/* Results available (200) */}
      {!isLoading && !isError && data?.result_available !== false && data && (
        <ResultsView data={data} onBack={() => navigate('/assessments')} />
      )}
    </div>
  );
}

// ── Pending state ─────────────────────────────────────────────────────────────
function PendingView({ message, attemptStatus, onBack }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="card p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
          <Clock4 style={{ width: 28, height: 28 }} className="text-amber-500" />
        </div>
        <div className="space-y-1.5">
          <p className="font-display font-bold text-lg text-gray-900">Results Not Available Yet</p>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            {message || 'Results will be published once the assessment cycle is completed by your instructor.'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Attempt {attemptStatus ?? 'Submitted'}
        </span>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 btn-secondary justify-center">
          My Assessments
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-[9px] transition-all text-sm"
        >
          Dashboard →
        </button>
      </div>
    </div>
  );
}

// ── Results view ──────────────────────────────────────────────────────────────
function ResultsView({ data, onBack }) {
  const navigate = useNavigate();
  const composite      = data.composite_score;
  const sectionScores  = data.section_scores ?? [];
  const breakdown      = data.answers_breakdown ?? [];
  const pct            = composite?.percentage_score != null ? Math.round(composite.percentage_score) : null;
  const color          = scoreColor(pct);
  const circumference  = 2 * Math.PI * 40;

  return (
    <div className="space-y-5">

      {/* Score hero card */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        {/* Circular score ring */}
        <div className="relative flex-shrink-0">
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            {pct != null && (
              <circle
                cx="52" cy="52" r="40"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - pct / 100)}
                transform="rotate(-90 52 52)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="stat-number text-xl leading-none" style={{ color }}>
              {pct != null ? `${pct}%` : '—'}
            </span>
            {composite?.grade && (
              <span className="text-xs font-bold mt-0.5" style={{ color }}>{composite.grade}</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <p className="font-display font-bold text-lg text-gray-900">{scoreLabel(pct)}</p>
            {composite?.total_score != null && (
              <p className="text-sm text-gray-500 mt-0.5">
                {composite.total_score} / {composite.max_score} points
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {composite?.percentile_rank != null && (
              <Chip icon={Trophy} label="Percentile" value={`${Math.round(composite.percentile_rank)}th`} color={color} />
            )}
            {data.submitted_at && (
              <Chip icon={Calendar} label="Submitted" value={formatDate(data.submitted_at)} />
            )}
          </div>
        </div>
      </div>

      {/* Section scores */}
      {sectionScores.length > 0 && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 style={{ width: 15, height: 15 }} className="text-indigo-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Section Breakdown</h3>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="space-y-3">
            {sectionScores.map((sec, i) => {
              const secPct = sec.percentage_score != null ? Math.round(sec.percentage_score) : null;
              const secColor = scoreColor(secPct);
              const sectionInfo = SECTION_LABELS[sec.section_name] ?? SECTION_LABELS[sec.section_key] ?? null;
              const displayName = sectionInfo
                ? `${sectionInfo.label} (${sectionInfo.weight}%)`
                : (sec.section_name || `Section ${i + 1}`);
              return (
                <div key={sec.id || i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">{displayName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {sec.questions_correct != null && (
                        <span>{sec.questions_correct}/{sec.questions_attempted ?? '—'} correct</span>
                      )}
                      {sec.time_taken_seconds != null && (
                        <span className="flex items-center gap-1">
                          <Clock4 style={{ width: 10, height: 10 }} />
                          {formatTime(sec.time_taken_seconds)}
                        </span>
                      )}
                      <span className="font-bold" style={{ color: secColor }}>
                        {secPct != null ? `${secPct}%` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${secPct ?? 0}%`, background: secColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Topic Analysis */}
      <TopicAnalysis topicAnalysis={data.topic_analysis} />

      {/* Answers breakdown */}
      {breakdown.length > 0 && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText style={{ width: 15, height: 15 }} className="text-indigo-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Answer Breakdown</h3>
            <span className="ml-auto text-xs text-gray-400">{breakdown.length} questions</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="space-y-2.5">
            {breakdown.map((item, i) => <AnswerRow key={item._id || i} index={i} item={item} />)}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 btn-secondary justify-center">
          My Assessments
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-[9px] transition-all text-sm"
        >
          Dashboard →
        </button>
      </div>
    </div>
  );
}

// ── Answer row ────────────────────────────────────────────────────────────────
function AnswerRow({ index, item }) {
  const isCorrect = item.is_correct === true;
  const isSkipped = item.student_answer == null || item.student_answer === '';
  const Icon  = isCorrect ? CheckCircle2 : isSkipped ? MinusCircle : XCircle;
  const color = isCorrect ? '#10B981'    : isSkipped ? '#94A3B8'   : '#EF4444';
  const bg    = isCorrect ? '#ECFDF5'    : isSkipped ? '#F8FAFC'   : '#FEF2F2';

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: bg }}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon style={{ width: 15, height: 15, color }} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          <span className="text-gray-400 font-normal mr-1">Q{index + 1}.</span>
          {item.question_text || item.question || `Question ${index + 1}`}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs">
          {!isSkipped && (
            <span>
              <span className="text-gray-400">Your answer: </span>
              <span className="font-semibold" style={{ color }}>{item.student_answer}</span>
            </span>
          )}
          {!isCorrect && item.correct_answer != null && (
            <span>
              <span className="text-gray-400">Correct: </span>
              <span className="font-semibold text-emerald-600">{item.correct_answer}</span>
            </span>
          )}
          {isSkipped && <span className="text-gray-400 italic">Skipped</span>}
        </div>
      </div>
    </div>
  );
}

// ── Topic Analysis ────────────────────────────────────────────────────────────
function TopicAnalysis({ topicAnalysis }) {
  if (!topicAnalysis || Object.keys(topicAnalysis).length === 0) return null;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen style={{ width: 15, height: 15 }} className="text-indigo-500" />
        <h3 className="font-semibold text-gray-800 text-sm">Topic Analysis</h3>
      </div>
      <div className="h-px bg-gray-100" />
      <div className="space-y-5">
        {Object.entries(topicAnalysis).map(([section, topics]) => (
          <div key={section}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 capitalize">{section}</p>
            <div className="space-y-3">
              {Object.entries(topics).map(([topicName, info]) => (
                <div key={topicName} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-gray-700 truncate">{topicName}</span>
                      <span
                        className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: info.weak ? '#FEF2F2' : '#ECFDF5',
                          color:      info.weak ? '#EF4444' : '#10B981',
                        }}
                      >
                        {info.weak ? 'Weak' : 'Strong'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-600 flex-shrink-0 ml-2">
                      {info.score != null ? `${info.score}%` : '—'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${info.score ?? 0}%`,
                        background: info.weak ? '#EF4444' : '#10B981',
                      }}
                    />
                  </div>
                  {info.weak && info.recommendation && (
                    <p className="text-xs text-gray-400 italic leading-relaxed">{info.recommendation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ icon: Icon, label, value, color = '#6366F1' }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
      <Icon style={{ width: 10, height: 10, color }} />
      <span className="text-xs text-gray-400 font-medium">{label}:</span>
      <span className="text-xs font-semibold text-gray-800">{value}</span>
    </div>
  );
}
