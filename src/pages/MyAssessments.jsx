import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Code2, Users, MessageSquare,
  Clock, CircleDot, CalendarDays, ChevronRight,
  AlertCircle, Trophy, Play, RotateCcw,
  Loader2, ClipboardList,
} from 'lucide-react';
import { useStudentCycles } from '../controllers/assessmentsController';
import { useAssessmentFlow } from '../context/AssessmentFlowContext';

const CATEGORY_ICON = {
  Aptitude:      BarChart3,
  Technical:     Code2,
  Behavioral:    Users,
  Communication: MessageSquare,
};
const CATEGORY_BADGE = {
  Aptitude:      'badge-aptitude',
  Technical:     'badge-technical',
  Behavioral:    'badge-behavioral',
  Communication: 'badge-communication',
};
const CATEGORY_COLOR = {
  Aptitude:      { bg: '#ECFDF5', icon: '#059669', ring: '#A7F3D0' },
  Technical:     { bg: '#EFF6FF', icon: '#2563EB', ring: '#BFDBFE' },
  Behavioral:    { bg: '#F5F3FF', icon: '#7C3AED', ring: '#DDD6FE' },
  Communication: { bg: '#FFFBEB', icon: '#D97706', ring: '#FDE68A' },
};
const STATUS_CONFIG = {
  scheduled:   { label: 'Scheduled',   dot: '#6366F1', bg: '#EEF2FF', text: '#4338CA' },
  active:      { label: 'Active',      dot: '#10B981', bg: '#ECFDF5', text: '#065F46' },
  in_progress: { label: 'In Progress', dot: '#F59E0B', bg: '#FFFBEB', text: '#92400E' },
  completed:   { label: 'Completed',   dot: '#10B981', bg: '#ECFDF5', text: '#065F46' },
  expired:     { label: 'Expired',     dot: '#94A3B8', bg: '#F1F5F9', text: '#475569' },
  missed:      { label: 'Missed',      dot: '#EF4444', bg: '#FEF2F2', text: '#991B1B' },
};
const CATEGORIES = ['All', 'Technical', 'Aptitude', 'Behavioral', 'Communication'];

// Derive subcategory topics for a given category from cycle list
function getSubcategories(cycles, category) {
  const topics = new Set();
  cycles.forEach(c => {
    if (category === 'All' || c.category === category) {
      (c.topics || []).forEach(t => topics.add(t));
    }
  });
  return ['All', ...Array.from(topics).sort()];
}

function fmtDate(iso)     { return iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'; }
function fmtDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MyAssessments() {
  const navigate = useNavigate();
  const { updateFlow } = useAssessmentFlow();

  // Main tab: 'scheduled' | 'attempted'
  const [mainTab,    setMainTab]    = useState('scheduled');
  const [catFilter,  setCatFilter]  = useState('All');
  const [subFilter,  setSubFilter]  = useState('All');

  const { data, isLoading, isError, refetch } = useStudentCycles();
  const allCycles = Array.isArray(data) ? data : (data?.cycles ?? []);

  const isAttempted = (c) =>
    c.attempt_status === 'submitted' || c.attempt?.status === 'completed' || c.status === 'completed';

  const scheduledCycles = allCycles.filter(c => !isAttempted(c));
  const attemptedCycles = allCycles.filter(c =>  isAttempted(c));
  const baseCycles      = mainTab === 'scheduled' ? scheduledCycles : attemptedCycles;

  // Subcategories derived from current base + category
  const subcategories = getSubcategories(baseCycles, catFilter);

  // Reset sub-filter when category or main tab changes
  const handleCatChange = (cat) => { setCatFilter(cat); setSubFilter('All'); };
  const handleMainTab   = (tab) => { setMainTab(tab); setCatFilter('All'); setSubFilter('All'); };

  const filtered = baseCycles.filter(c => {
    const matchCat = catFilter === 'All' || c.category === catFilter;
    const matchSub = subFilter === 'All' || (c.topics || []).includes(subFilter);
    return matchCat && matchSub;
  });

  const total      = allCycles.length;
  const completed  = attemptedCycles.length;
  const active     = allCycles.filter(c => c.status === 'active').length;
  const scored     = allCycles.filter(c => c.attempt?.score != null);
  const avgScore   = scored.length ? Math.round(scored.reduce((s, c) => s + c.attempt.score, 0) / scored.length) : null;

  function handleAttempt(cycle) {
    updateFlow({
      cycleId:    cycle.id || cycle._id,
      examConfig: {
        title:          cycle.title,
        description:    cycle.description || '',
        category:       cycle.category || '',
        duration:       cycle.duration_minutes ?? cycle.duration,
        totalQuestions: cycle.total_questions ?? cycle.totalQuestions ?? 0,
        topics:         cycle.topics_covered  ?? cycle.topics ?? [],
        instructions:   cycle.instructions    ?? [],
      },
    });
    navigate('/assessment/overview');
  }

  function handleViewResult(cycle) {
    const aid =
      cycle.attempt?._id      ||
      cycle.attempt?.id       ||
      cycle.attempt?.attempt_id ||
      cycle.attempt_id        ||
      cycle.attemptId         ||
      cycle.last_attempt_id;
    if (aid) {
      navigate(`/assessment/result/${aid}`);
    }
  }

  return (
    <div className="page-enter p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <style>{`
        .cycle-card{transition:box-shadow .18s,transform .18s}
        .cycle-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(79,70,229,.10)}
        .tab-pill{padding:6px 14px;border-radius:9999px;font-size:13px;font-weight:600;transition:all .15s;cursor:pointer;border:none;background:none}
        .tab-pill.active{background:#4F46E5;color:#fff}
        .tab-pill.inactive{background:#F1F5F9;color:#64748B}
        .tab-pill.inactive:hover{background:#E2E8F0;color:#1E293B}
        .cat-pill{padding:5px 12px;border-radius:9999px;font-size:12px;font-weight:600;transition:all .15s;cursor:pointer;background:none}
        .cat-pill.active{border:1px solid #4F46E5;background:#EEF2FF;color:#4338CA}
        .cat-pill.inactive{background:#F8FAFC;color:#64748B;border:1px solid #E2E8F0}
        .cat-pill.inactive:hover{border-color:#C7D2FE;background:#F5F3FF;color:#4F46E5}
        @keyframes skShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .skeleton{background:linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%);background-size:400px 100%;animation:skShimmer 1.4s ease-in-out infinite;border-radius:8px}
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-gray-900">My Assessments</h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLoading ? 'Loading your scheduled assessments…'
              : total > 0 ? `${total} assessment${total !== 1 ? 's' : ''} assigned to you`
              : 'No assessments have been scheduled for you yet'}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Stats */}
      {total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',     value: total,                           icon: ClipboardList, color: '#4F46E5' },
            { label: 'Completed', value: completed,                       icon: Trophy,        color: '#10B981' },
            { label: 'Active',    value: active,                          icon: Play,          color: '#F59E0B' },
            { label: 'Avg Score', value: avgScore != null ? `${avgScore}%` : '—', icon: BarChart3, color: '#6366F1' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <div key={label} className="card p-4 flex flex-col gap-2" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon style={{ width: 14, height: 14, color }} />
                </div>
              </div>
              <p className="stat-number text-2xl text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 space-y-3">
        {/* Row 1 — Main tabs */}
        <div className="flex gap-2">
          {[
            { key: 'scheduled', label: 'Scheduled', count: scheduledCycles.length },
            { key: 'attempted', label: 'Attempted',  count: attemptedCycles.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              className={`tab-pill flex items-center gap-1.5 ${mainTab === key ? 'active' : 'inactive'}`}
              onClick={() => handleMainTab(key)}
            >
              {label}
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: mainTab === key ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                  color:      mainTab === key ? '#fff' : '#64748B',
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Row 2 — Category */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</p>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`cat-pill ${catFilter === c ? 'active' : 'inactive'}`}
                onClick={() => handleCatChange(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3 — Subcategory (only when topics exist) */}
        {subcategories.length > 1 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subcategory</p>
            <div className="flex gap-1.5 flex-wrap">
              {subcategories.map(s => (
                <button
                  key={s}
                  className={`cat-pill ${subFilter === s ? 'active' : 'inactive'}`}
                  onClick={() => setSubFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading && <SkeletonList />}

      {isError && (
        <div className="card p-10 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 opacity-60" />
          <p className="font-semibold text-gray-700">Could not load assessments</p>
          <p className="text-sm text-gray-400">Check your connection and try again</p>
          <button className="btn-primary mt-2" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="card p-12 flex flex-col items-center gap-3 text-center">
          <ClipboardList className="w-10 h-10 text-gray-300" />
          <p className="font-semibold text-gray-600">
            {allCycles.length === 0 ? 'No assessments assigned yet' : 'No assessments match these filters'}
          </p>
          <p className="text-sm text-gray-400">
            {allCycles.length === 0 ? 'Your instructor will schedule assessments for you' : 'Try a different status or category'}
          </p>
          {allCycles.length > 0 && (
            <button className="btn-secondary mt-2 text-sm" onClick={() => { setCatFilter('All'); setSubFilter('All'); }}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((cycle, i) => (
            <CycleCard key={cycle._id || cycle.id || i} cycle={cycle} delay={i * 50} onAttempt={handleAttempt} onViewResult={handleViewResult} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── CycleCard ─────────────────────────────────────────────────────────────────
function CycleCard({ cycle, delay, onAttempt, onViewResult }) {
  // Normalise field names — support both API shape and legacy shape
  const cat         = cycle.category || '';
  const duration    = cycle.duration_minutes ?? cycle.duration;
  const totalQ      = cycle.total_questions  ?? cycle.totalQuestions ?? cycle.questionCount;
  const topics      = cycle.topics_covered   ?? cycle.topics ?? [];
  const startDate   = cycle.start_date       ?? cycle.scheduledAt;
  const endDate     = cycle.end_date         ?? cycle.expiresAt;

  const Icon   = CATEGORY_ICON[cat]   || ClipboardList;
  const colors = CATEGORY_COLOR[cat]  || { bg: '#F1F5F9', icon: '#64748B', ring: '#E2E8F0' };
  const badge  = CATEGORY_BADGE[cat]  || null;

  const isCompleted = cycle.attempt_status === 'submitted' || cycle.attempt?.status === 'completed' || cycle.status === 'completed';
  const isExpired   = cycle.status === 'expired' || cycle.status === 'missed';
  const isScheduled = cycle.status === 'scheduled' && !isCompleted && !isExpired;
  const canAttempt  = cycle.status === 'active'    && !isCompleted && !isExpired;

  const rawStatus = isCompleted ? 'completed' : (cycle.status ?? 'scheduled');
  const sc        = STATUS_CONFIG[rawStatus] || STATUS_CONFIG.scheduled;
  const score     = cycle.attempt?.score ?? cycle.attempt?.percentage ?? null;

  return (
    <div className="card cycle-card p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: colors.bg, border: `1.5px solid ${colors.ring}` }}>
          <Icon style={{ width: 20, height: 20, color: colors.icon }} />
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{cycle.title}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                  style={{ background: sc.bg, color: sc.text }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                  {sc.label}
                </span>
                {badge && <span className={badge}>{cat}</span>}
              </div>
              {cycle.description && (
                <p className="text-xs text-gray-500 leading-relaxed"
                  style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {cycle.description}
                </p>
              )}
            </div>

            {/* Score (attempted) */}
            {isCompleted && score != null && (
              <div className="flex-shrink-0 text-right">
                <p className="stat-number text-xl text-indigo-600">{score}%</p>
                <p className="text-xs text-gray-400">Score</p>
              </div>
            )}
          </div>

          {/* Stats chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {duration != null && (
              <StatChip icon={Clock} label="Duration" value={`${duration} min`} />
            )}
            {totalQ != null && (
              <StatChip icon={CircleDot} label="Questions" value={totalQ} />
            )}
            {startDate && (
              <StatChip icon={CalendarDays} label="Starts" value={fmtDateTime(startDate)} />
            )}
            {endDate && (
              <StatChip icon={CalendarDays} label="Ends" value={fmtDate(endDate)} accent={isExpired} />
            )}
          </div>

          {/* Topics */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {topics.map(t => (
                <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 self-center ml-1">
          {(canAttempt || isScheduled) && (
            <button
              onClick={canAttempt ? () => onAttempt(cycle) : undefined}
              disabled={isScheduled}
              title={isScheduled ? 'Exam has not started yet' : undefined}
              className="flex items-center gap-1.5 font-semibold px-4 py-2.5 rounded-[9px] text-sm transition-all whitespace-nowrap disabled:cursor-not-allowed"
              style={{
                background: isScheduled ? '#E2E8F0' : '#4F46E5',
                color:      isScheduled ? '#94A3B8' : '#fff',
              }}
            >
              <Play style={{ width: 13, height: 13 }} />
              {isScheduled ? 'Not Started' : 'Attempt'}
            </button>
          )}
          {isCompleted && (
            <button
              onClick={() => onViewResult(cycle)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold text-sm whitespace-nowrap"
            >
              Results <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          )}
          {isExpired && !isCompleted && (
            <span className="text-xs text-gray-400 font-medium">Expired</span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
      <Icon style={{ width: 11, height: 11, color: accent ? '#EF4444' : '#6366F1' }} />
      <span className="text-xs text-gray-400 font-medium">{label}:</span>
      <span className="text-xs font-semibold" style={{ color: accent ? '#EF4444' : '#1E293B' }}>{value}</span>
    </div>
  );
}


function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="card p-5 flex items-start gap-4">
          <div className="skeleton w-11 h-11 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-2/5 rounded" />
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/3 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
