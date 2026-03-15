import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flag, ChevronLeft, ChevronRight, Timer, Maximize,
  AlertTriangle, X, Camera, CameraOff, ShieldAlert,
} from 'lucide-react';
import { useAssessmentFlow } from '../context/AssessmentFlowContext';
import { examQuestions } from '../data/mockData';
import {
  getStream, stopCamera, detectPhone,
  removeKeyLock, removeScreenBlock,
} from '../services/proctorService';

// ─── Constants ────────────────────────────────────────────────
const LETTERS = ['A', 'B', 'C', 'D'];
const MAX_VIOLATIONS = 3;

const DIFF_STYLE = {
  easy:   'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100  text-amber-700',
  hard:   'bg-red-100    text-red-700',
};

const TOPIC_BADGE = (t) => {
  if (t.includes('Quantitative')) return 'badge-aptitude';
  if (t.includes('Logical'))      return 'badge-behavioral';
  if (t.includes('Data'))         return 'badge-technical';
  return 'badge-aptitude';
};

const VIOLATION_COPY = {
  tab:        { title: 'Tab Switch Detected',      msg: 'You switched to another tab or window. This is not allowed during the exam.', icon: '🔍' },
  fullscreen: { title: 'Fullscreen Exited',         msg: 'You exited fullscreen mode. All exam sessions must remain in fullscreen.', icon: '⚠️' },
  copy:       { title: 'Copy/Paste Blocked',        msg: 'Clipboard operations are not permitted during the exam.', icon: '📋' },
  screenshot: { title: 'Screenshot Attempt Blocked', msg: 'Screenshot tools are disabled during proctored exams.', icon: '📸' },
  phone:      { title: 'Phone Detected',            msg: 'A mobile device was detected in the camera frame. Please remove it.', icon: '📱' },
};

// ─── Component ───────────────────────────────────────────────
export default function AssessmentExam() {
  const navigate   = useNavigate();
  const { flow, updateFlow } = useAssessmentFlow();

  // ── local state ──
  const [currentQ,     setCurrentQ]     = useState(0);
  const [localAnswers, setLocalAnswers] = useState({});
  const [localFlagged, setLocalFlagged] = useState([]);
  const [timeLeft,     setTimeLeft]     = useState(null);
  const [showModal,    setShowModal]    = useState(false);

  // Violations
  const [violations,       setViolations]       = useState([]);  // array of type strings
  const [violationOverlay, setViolationOverlay] = useState(null); // { type } | null
  const [terminated,       setTerminated]        = useState(false);

  // Fullscreen gate
  const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement);

  // Camera panel
  const [camActive,    setCamActive]    = useState(false);
  const [phoneScore,   setPhoneScore]   = useState(0);
  const videoRef   = useRef(null);
  const pdInterval = useRef(null);

  // ── refs to avoid stale closures ──
  const answersRef    = useRef({});
  const flaggedRef    = useRef([]);
  const violationsRef = useRef([]);
  const terminatedRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { answersRef.current  = localAnswers; }, [localAnswers]);
  useEffect(() => { flaggedRef.current  = localFlagged; }, [localFlagged]);
  useEffect(() => { violationsRef.current = violations; }, [violations]);

  // ── guard: redirect if no flow state ──
  useEffect(() => {
    if (!flow.examConfig || !flow.startTime) {
      navigate('/assessment/register');
    }
  }, []);

  // ── watermark tile (canvas → data-URL, repeated as CSS background) ──
  const watermarkStyle = useMemo(() => {
    const name = flow.fullName  || 'Student';
    const sid  = flow.studentId || '';
    const code = flow.examCode  || '';
    const fp   = flow.fingerprint || '';

    const W = 420, H = 140;
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 7);
    ctx.globalAlpha = 0.055;
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px "DM Sans", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${name}  ·  ${sid}`, 0, -8);
    ctx.font = '11px monospace';
    ctx.fillText(`${code}  ·  ${fp}`, 0, 12);
    ctx.restore();
    return {
      position: 'fixed', inset: 0,
      zIndex: 46, pointerEvents: 'none',
      backgroundImage: `url(${canvas.toDataURL()})`,
      backgroundRepeat: 'repeat',
    };
  }, [flow.fullName, flow.studentId, flow.examCode, flow.fingerprint]);

  if (!flow.examConfig || !flow.startTime) return null;

  const questions     = examQuestions[flow.examCode] || [];
  const totalDuration = flow.examConfig.duration * 60;

  // ── submit (stable via ref) ──
  const doSubmitRef = useRef(null);
  doSubmitRef.current = (reason = 'manual') => {
    if (terminatedRef.current) return;
    terminatedRef.current = true;
    clearInterval(pdInterval.current);
    removeKeyLock();
    removeScreenBlock();
    stopCamera();
    updateFlow({
      answers:          answersRef.current,
      flaggedQuestions: flaggedRef.current,
      isSubmitted:      true,
      terminatedReason: reason,
    });
    navigate('/assessment/complete');
  };

  // ── timer ──
  useEffect(() => {
    function tick() {
      const elapsed    = Math.floor((Date.now() - flow.startTime) / 1000);
      const remaining  = Math.max(0, totalDuration - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) doSubmitRef.current('timeout');
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [flow.startTime, totalDuration]);

  // ── camera panel ──
  useEffect(() => {
    const stream = getStream();
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      setCamActive(true);
    }
    // Phone detection loop — every 600ms
    pdInterval.current = setInterval(() => {
      if (!videoRef.current || terminatedRef.current) return;
      const score = detectPhone(videoRef.current);
      setPhoneScore(score);
      if (score > 0.45) {
        triggerViolation('phone');
      }
    }, 600);
    return () => clearInterval(pdInterval.current);
  }, []);

  // ── fullscreen: enter on mount + enforce ──
  useEffect(() => {
    function enterFullscreen() {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }

    // Enter fullscreen immediately (works if navigated via button click — counts as user gesture)
    if (!document.fullscreenElement) enterFullscreen();

    function onFsChange() {
      const inFs = !!document.fullscreenElement;
      setIsFullscreen(inFs);
      if (!inFs && !terminatedRef.current) {
        triggerViolation('fullscreen');
      }
    }

    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // ── tab switch detection ──
  useEffect(() => {
    function onVisibility() {
      if (document.hidden && !terminatedRef.current) {
        triggerViolation('tab');
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ── copy/paste blocker ──
  useEffect(() => {
    function block(e) {
      e.preventDefault();
      triggerViolation('copy');
    }
    ['copy', 'cut', 'paste'].forEach(ev => document.addEventListener(ev, block));
    return () => ['copy', 'cut', 'paste'].forEach(ev => document.removeEventListener(ev, block));
  }, []);

  // ── screenshot detection (keydown + keyup + blur) ──
  useEffect(() => {
    function blackout() {
      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;pointer-events:none;';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 800);
    }

    function onKeydown(e) {
      const isPrtSc = e.key === 'PrintScreen' || e.code === 'PrintScreen';
      const hasWinKey = e.metaKey || e.getModifierState?.('Meta') || e.getModifierState?.('OS');
      const isSnip = e.shiftKey && hasWinKey && e.key?.toLowerCase() === 's';
      if (isPrtSc || isSnip) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard?.writeText('').catch(() => {});
        triggerViolation('screenshot');
        blackout();
      }
    }

    // Firefox / some Chrome builds only fire PrintScreen on keyup
    function onKeyup(e) {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard?.writeText('').catch(() => {});
        triggerViolation('screenshot');
        blackout();
      }
    }

    // Win+Shift+S opens Snipping Tool overlay which steals window focus
    function onBlur() {
      if (!terminatedRef.current) triggerViolation('screenshot');
    }

    document.addEventListener('keydown', onKeydown, true);
    document.addEventListener('keyup',   onKeyup,   true);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('keydown', onKeydown, true);
      document.removeEventListener('keyup',   onKeyup,   true);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // ── violation logic ──
  function triggerViolation(type) {
    if (terminatedRef.current) return;
    const current = violationsRef.current;

    // Debounce: skip same-type violation within 8s
    const last = current.filter(v => v === type);
    if (last.length > 0) {
      // phone detection is frequent — only re-trigger every 15s
      if (type === 'phone') return;
    }

    const next = [...current, type];
    setViolations(next);
    violationsRef.current = next;
    setViolationOverlay({ type });

    if (next.length >= MAX_VIOLATIONS) {
      setTerminated(true);
      setTimeout(() => doSubmitRef.current('terminated'), 2000);
    }
  }

  function dismissViolation() {
    setViolationOverlay(null);
    if (terminatedRef.current) doSubmitRef.current('terminated');
  }

  // ── derived ──
  const answeredCount   = Object.keys(localAnswers).length;
  const unansweredCount = questions.length - answeredCount;
  const q               = questions[currentQ];
  const isFlagged       = localFlagged.includes(currentQ);
  const selectedOption  = localAnswers[currentQ] ?? null;

  const mins = timeLeft !== null ? Math.floor(timeLeft / 60) : flow.examConfig.duration;
  const secs = timeLeft !== null ? timeLeft % 60 : 0;
  const timerColor =
    timeLeft !== null && timeLeft <= 60  ? '#EF4444' :
    timeLeft !== null && timeLeft <= 300 ? '#F59E0B' : '#10B981';

  const phoneDanger  = phoneScore > 0.45;
  const phoneWarning = phoneScore > 0.28;

  // ── handlers ──
  function selectOption(idx)  { setLocalAnswers(prev => ({ ...prev, [currentQ]: idx })); }
  function toggleFlag()       { setLocalFlagged(prev => prev.includes(currentQ) ? prev.filter(i => i !== currentQ) : [...prev, currentQ]); }
  function prevQ()            { setCurrentQ(q => Math.max(0, q - 1)); }
  function nextQ()            { setCurrentQ(q => Math.min(questions.length - 1, q + 1)); }

  const vInfo = violationOverlay ? (VIOLATION_COPY[violationOverlay.type] || VIOLATION_COPY.tab) : null;

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col" style={{ zIndex: 50 }}>
      {/* ── Identity Watermark ───────────────────────────────── */}
      <div style={watermarkStyle} aria-hidden="true" />

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform: scale(0.94) translateY(10px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes violIn {
          from { opacity:0; transform: scale(0.92); }
          to   { opacity:1; transform: scale(1); }
        }
        @keyframes camBlink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
        .modal-in   { animation: modalIn  0.2s ease-out forwards; }
        .viol-in    { animation: violIn   0.25s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
        .cam-blink  { animation: camBlink 1.2s ease-in-out infinite; }
      `}</style>

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-semibold text-gray-900 text-sm truncate max-w-[200px] md:max-w-xs">
            {flow.examConfig.title}
          </span>
          <span className="hidden sm:inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-600 flex-shrink-0">
            Q {currentQ + 1} / {questions.length}
          </span>
          {/* Violation counter */}
          {violations.length > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
              <ShieldAlert style={{ width: 12, height: 12 }} className="text-red-500" />
              <span className="text-xs font-bold text-red-600">{violations.length}/{MAX_VIOLATIONS}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Timer */}
          <div
            className="flex items-center gap-1.5 border rounded-[9px] px-3 py-1.5 transition-colors duration-300"
            style={{
              background: timerColor === '#EF4444' ? 'rgba(239,68,68,0.08)' : '#F8FAFC',
              borderColor: timerColor === '#EF4444' ? 'rgba(239,68,68,0.3)' : '#E2E8F0',
            }}
          >
            <Timer style={{ width: 14, height: 14, color: timerColor }} />
            <span className="text-sm font-bold tabular-nums" style={{ color: timerColor, fontFamily: 'monospace' }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>
          {/* Submit */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-[9px] text-sm transition-all"
          >
            Submit
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex">

        {/* Left: Question */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {q && (
              <div className="max-w-2xl mx-auto space-y-4">

                {/* Topic / difficulty / flag row */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`${TOPIC_BADGE(q.topic)} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                      {q.topic}
                    </span>
                    <span className={`${DIFF_STYLE[q.difficulty]} text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={toggleFlag}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-[9px] transition-all"
                    style={{
                      background:   isFlagged ? 'rgba(245,158,11,0.1)' : '#F8FAFC',
                      color:        isFlagged ? '#D97706' : '#94A3B8',
                      border: `1px solid ${isFlagged ? 'rgba(245,158,11,0.35)' : '#E2E8F0'}`,
                    }}
                  >
                    <Flag style={{ width: 12, height: 12 }} fill={isFlagged ? '#D97706' : 'none'} />
                    {isFlagged ? 'Flagged' : 'Flag'}
                  </button>
                </div>

                {/* Question card */}
                <div className="card p-5 md:p-6">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
                    Question {currentQ + 1}
                  </p>
                  <p className="text-base md:text-lg text-gray-800 font-medium leading-relaxed">
                    {q.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    const sel = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectOption(idx)}
                        className="w-full flex items-center gap-4 rounded-xl p-4 text-left transition-all duration-150 hover:scale-[1.005]"
                        style={{
                          background:   sel ? '#EEF2FF' : '#FFFFFF',
                          border:       sel ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                          boxShadow:    sel ? '0 0 0 3px rgba(79,70,229,0.08)' : undefined,
                        }}
                      >
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                          style={{
                            background: sel ? '#4F46E5' : '#F1F5F9',
                            color:      sel ? '#FFF'    : '#64748B',
                          }}
                        >
                          {LETTERS[idx]}
                        </span>
                        <span className="text-sm text-gray-700 font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 md:px-6 py-3 flex items-center justify-between">
            <button
              onClick={prevQ}
              disabled={currentQ === 0}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft style={{ width: 16, height: 16 }} /> Previous
            </button>
            <span className="text-xs text-gray-500 font-medium hidden sm:block">
              <span className="font-bold text-indigo-600">{answeredCount}</span> / {questions.length} answered
            </span>
            <button
              onClick={nextQ}
              disabled={currentQ === questions.length - 1}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Right: Navigator + Camera */}
        <div className="hidden lg:flex w-64 xl:w-72 flex-col border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0">

          {/* Camera panel */}
          <div className="border-b border-gray-100 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                {camActive
                  ? <Camera style={{ width: 13, height: 13 }} className="text-emerald-500" />
                  : <CameraOff style={{ width: 13, height: 13 }} className="text-gray-400" />}
                <span className="text-xs font-semibold text-gray-600">Proctor Cam</span>
              </div>
              {camActive && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 cam-blink" />
                  <span className="text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>REC</span>
                </div>
              )}
            </div>
            <div
              className="relative rounded-lg overflow-hidden bg-gray-900"
              style={{ height: 100 }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />
              {!camActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CameraOff style={{ width: 20, height: 20 }} className="text-gray-600" />
                </div>
              )}
            </div>
            {/* Phone detection status */}
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <span className="text-xs text-gray-400">Phone detect</span>
              <span
                className="text-xs font-semibold"
                style={{ color: phoneDanger ? '#EF4444' : phoneWarning ? '#F59E0B' : '#10B981' }}
              >
                {phoneDanger ? '⚠ DETECTED' : phoneWarning ? '~ Uncertain' : '✓ Clear'}
              </span>
            </div>
          </div>

          {/* Navigator */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            <p className="font-semibold text-gray-800 text-sm">Question Navigator</p>

            {/* Legend */}
            <div className="flex flex-col gap-1.5">
              {[
                { color: '#4F46E5', border: 'none',                          label: 'Answered' },
                { color: '#FEF3C7', border: '2px solid #FBBF24',             label: 'Flagged'  },
                { color: '#F1F5F9', border: '1px solid #E2E8F0',             label: 'Not Answered' },
              ].map(({ color, border, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color, border }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((_, idx) => {
                const ans  = localAnswers[idx] !== undefined;
                const flag = localFlagged.includes(idx);
                const cur  = idx === currentQ;

                let bg = '#F1F5F9', border = '1px solid #E2E8F0', color = '#64748B';
                if (ans && !flag) { bg = '#4F46E5'; border = 'none'; color = '#FFF'; }
                if (flag)         { bg = '#FEF3C7'; border = '2px solid #FBBF24'; color = '#92400E'; }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQ(idx)}
                    className="aspect-square rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: bg, border, color,
                      outline:       cur ? '2px solid #4F46E5' : undefined,
                      outlineOffset: cur ? '1px' : undefined,
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 mt-auto">
              {[
                { label: 'Answered',     val: answeredCount,        color: '#4F46E5' },
                { label: 'Not Answered', val: unansweredCount,      color: '#64748B' },
                { label: 'Flagged',      val: localFlagged.length,  color: '#D97706' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold" style={{ color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit Modal ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 60 }}>
          <div className="modal-in bg-white rounded-[14px] shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle style={{ width: 18, height: 18 }} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Submit Assessment?</p>
                  <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {unansweredCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-[9px] px-4 py-3">
                <p className="text-amber-700 text-sm font-medium">
                  You have <span className="font-bold">{unansweredCount}</span> unanswered{' '}
                  {unansweredCount === 1 ? 'question' : 'questions'}.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600">
              {answeredCount} of {questions.length} answered. Once submitted you cannot return.
            </p>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 btn-secondary justify-center">
                Review
              </button>
              <button
                onClick={() => doSubmitRef.current('manual')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-[9px] text-sm transition-all"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Violation Overlay ────────────────────────────────── */}
      {violationOverlay && vInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 70 }}>
          <div className="viol-in bg-white rounded-[14px] shadow-2xl w-full max-w-md p-6 space-y-4">
            {/* Icon + title */}
            <div className="text-center">
              <div className="text-4xl mb-2">{vInfo.icon}</div>
              <p className="font-display font-bold text-lg text-gray-900">{vInfo.title}</p>
            </div>

            {/* Violation dots */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: MAX_VIOLATIONS }).map((_, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ background: i < violations.length ? '#EF4444' : '#E2E8F0' }}
                />
              ))}
            </div>

            <p className="text-sm text-gray-600 text-center leading-relaxed">{vInfo.msg}</p>

            <div className="bg-amber-50 border border-amber-200 rounded-[9px] px-4 py-2.5">
              <p className="text-amber-700 text-xs text-center font-semibold">
                {terminated
                  ? 'Max violations reached. Exam is being submitted…'
                  : `Violation ${violations.length} of ${MAX_VIOLATIONS} — ${MAX_VIOLATIONS - violations.length} remaining`}
              </p>
            </div>

            {!terminated && (
              <button
                onClick={dismissViolation}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-[9px] text-sm transition-all"
              >
                I Understand — Continue Exam
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Fullscreen Gate ──────────────────────────────────── */}
      {!isFullscreen && (
        <div className="fixed inset-0 bg-[#0F172A]/95 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: 80 }}>
          <div className="viol-in bg-white rounded-[14px] shadow-2xl w-full max-w-sm p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <Maximize style={{ width: 24, height: 24 }} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-gray-900">Fullscreen Required</p>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                This exam must be taken in fullscreen mode. Click below to continue.
              </p>
            </div>
            <button
              onClick={() => document.documentElement.requestFullscreen?.()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-[9px] text-sm transition-all"
            >
              Enter Fullscreen →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
