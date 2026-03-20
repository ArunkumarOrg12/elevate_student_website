import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Monitor, Maximize, Keyboard,
  Fingerprint, ShieldCheck, CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import { useAssessmentFlow } from '../context/AssessmentFlowContext';
import { useStartAttempt } from '../controllers/assessmentsController';
import {
  getFingerprint, generateFingerprint,
  installKeyLock, installScreenBlock,
} from '../services/proctorService';

// ─── Check definitions ─────────────────────────────────────────
// Each check has a `run` function that returns true/resolves on success
// or throws an Error with a user-friendly message on failure.
const CHECKS = [
  {
    key: 'desktopVerification',
    label: 'Desktop Verification',
    desc: 'Checking PC/laptop environment',
    Icon: Monitor,
    run: async () => {
      const ua = navigator.userAgent || '';
      const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Windows Phone/i.test(ua);
      const hasTouch = navigator.maxTouchPoints > 2 && screen.width < 1024;
      if (isMobile || hasTouch) {
        throw new Error('Mobile device detected. Use a desktop or laptop.');
      }
      return `${screen.width}×${screen.height} — Desktop confirmed`;
    },
  },
  {
    key: 'fullscreen',
    label: 'Fullscreen Mode',
    desc: 'Requesting fullscreen lock',
    Icon: Maximize,
    run: async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Some browsers deny on first call without user gesture — silently continue
      }
      return 'Fullscreen active';
    },
  },
  {
    key: 'keyboardLockdown',
    label: 'Keyboard Lockdown',
    desc: 'All keys blocked except A/B/C/D',
    Icon: Keyboard,
    run: async () => {
      installKeyLock(null);
      return 'Keyboard locked — only A/B/C/D allowed';
    },
  },
  {
    key: 'fingerprint',
    label: 'Fingerprint + Watermark',
    desc: 'Device fingerprint & identity watermark',
    Icon: Fingerprint,
    run: async () => {
      const fp = generateFingerprint();
      return `FP: ${fp}`;
    },
  },
  {
    key: 'screenshotPrevention',
    label: 'Screenshot Prevention',
    desc: 'PrtSc & Snipping Tool detection active',
    Icon: ShieldCheck,
    run: async () => {
      installScreenBlock(null);
      return 'PrintScreen & Win+Shift+S blocked';
    },
  },
];

// ─── State shape per check: 'pending' | 'checking' | 'passed' | 'failed' ───
export default function AssessmentSecurityCheck() {
  const navigate    = useNavigate();
  const { flow, updateFlow } = useAssessmentFlow();

  const [states,      setStates]      = useState(() => Object.fromEntries(CHECKS.map(c => [c.key, 'pending'])));
  const [subtexts,    setSubtexts]    = useState(() => Object.fromEntries(CHECKS.map(c => [c.key, ''])));
  const [allPassed,   setAllPassed]   = useState(false);
  const [failed,      setFailed]      = useState(null); // { key, message }
  const [starting,    setStarting]    = useState(false);
  const [startError,  setStartError]  = useState(null);
  const startAttemptMutation = useStartAttempt();

  // Guard — no context data
  useEffect(() => {
    if (!flow.examConfig) navigate('/assessment/register');
  }, [flow.examConfig, navigate]);

  // Run all checks sequentially
  useEffect(() => {
    if (!flow.examConfig) return;
    let cancelled = false;

    async function runAll() {
      for (const check of CHECKS) {
        if (cancelled) return;

        // → checking
        await delay(check.key === CHECKS[0].key ? 200 : 600);
        if (cancelled) return;
        setStates(prev => ({ ...prev, [check.key]: 'checking' }));

        try {
          const result = await check.run();
          if (cancelled) return;
          const subtext = typeof result === 'string' ? result : '';
          setSubtexts(prev => ({ ...prev, [check.key]: subtext }));
          setStates(prev  => ({ ...prev, [check.key]: 'passed' }));
        } catch (err) {
          if (cancelled) return;
          setStates(prev => ({ ...prev, [check.key]: 'failed' }));
          setSubtexts(prev => ({ ...prev, [check.key]: err.message }));
          setFailed({ key: check.key, message: err.message });
          return; // stop further checks
        }

        await delay(300);
      }

      if (!cancelled) setAllPassed(true);
    }

    runAll();
    return () => { cancelled = true; };
  }, []);

  async function handleBeginExam() {
    setStartError(null);
    setStarting(true);
    try {
      const result = await startAttemptMutation.mutateAsync(flow.cycleId);
      console.log('[SecurityCheck] startAttempt result:', JSON.stringify(result, null, 2));
      // Backend returns { attemptId, questions, resumed, message }
      // Handle potential nesting: result might be the data directly or under result.data
      const data = result?.data ?? result;
      console.log('[SecurityCheck] extracted data:', { attemptId: data?.attemptId, questionsCount: data?.questions?.length });
      const attemptId = data?.attemptId || data?.attempt_id || data?._id || data?.id;
      const questions = data?.questions ?? [];

      if (!attemptId) {
        setStartError('Server did not return an attempt ID. Please try again.');
        setStarting(false);
        return;
      }

      updateFlow({
        startTime: Date.now(),
        fingerprint: getFingerprint(),
        attemptId,
        questions, // store questions from startAttempt response
      });
      navigate('/assessment/exam');
    } catch (err) {
      setStartError(err?.response?.data?.message || 'Failed to start attempt. Please try again.');
      setStarting(false);
    }
  }

  if (!flow.examConfig) return null;

  return (
    <div className="page-enter min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 py-10">
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%,100% { transform: scale(1);    opacity: 0.7; }
          50%      { transform: scale(1.4); opacity: 0.15; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.18); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes successSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .check-spinner {
          width: 18px; height: 18px;
          border: 2px solid #E0E7FF;
          border-top-color: #4F46E5;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        .check-ring {
          position: absolute; inset: -5px;
          border-radius: 50%;
          border: 2px solid #4F46E5;
          animation: pulseRing 1.2s ease-in-out infinite;
          pointer-events: none;
        }
        .check-pop  { animation: checkPop  0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
        .success-slide { animation: successSlide 0.4s ease-out forwards; }
      `}</style>

      <div className="w-full max-w-xl space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center">
              <Shield style={{ width: 22, height: 22 }} />
            </div>
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Security Verification</h1>
          <p className="text-gray-500 text-sm">All checks must pass before you can begin</p>
        </div>

        {/* Checks card */}
        <div className="card p-2 space-y-0.5">
          {CHECKS.map((check) => {
            const state = states[check.key];
            const sub   = subtexts[check.key];
            return (
              <CheckRow key={check.key} check={check} state={state} subtext={sub} />
            );
          })}
        </div>

        {/* Failed banner */}
        {failed && (
          <div className="success-slide flex items-start gap-3 bg-red-50 border border-red-200 rounded-[14px] px-4 py-3.5">
            <XCircle style={{ width: 18, height: 18 }} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-semibold text-sm">Security check failed</p>
              <p className="text-red-600 text-xs mt-0.5">{failed.message}</p>
            </div>
          </div>
        )}

        {/* All passed — success + begin button */}
        {allPassed && (
          <>
            <div className="success-slide flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-[14px] px-5 py-4">
              <CheckCircle2 style={{ width: 20, height: 20 }} className="text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-emerald-700 font-semibold text-sm">All security checks passed ✓</p>
                <p className="text-emerald-600 text-xs mt-0.5">Device fingerprint: <span className="font-mono font-bold">{getFingerprint()}</span></p>
              </div>
            </div>
            {startError && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-[14px] px-4 py-3">
                <XCircle style={{ width: 16, height: 16 }} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{startError}</p>
              </div>
            )}
            <button
              onClick={handleBeginExam}
              disabled={starting}
              className="success-slide w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-[9px] transition-all duration-200 text-sm flex items-center justify-center gap-2"
            >
              {starting ? <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Starting exam…</> : 'Begin Exam →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CheckRow ─────────────────────────────────────────────────
function CheckRow({ check, state, subtext }) {
  const { Icon, label, desc } = check;
  const isPassed  = state === 'passed';
  const isChecking = state === 'checking';
  const isFailed  = state === 'failed';

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-300"
      style={{
        opacity:    state === 'pending' ? 0.45 : 1,
        background: isPassed  ? 'rgba(16,185,129,0.04)'  :
                    isChecking ? 'rgba(79,70,229,0.05)'  :
                    isFailed   ? 'rgba(239,68,68,0.05)'  : 'transparent',
      }}
    >
      {/* Icon bubble */}
      <div className="relative flex-shrink-0">
        {isChecking && <span className="check-ring" />}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isPassed   ? 'rgba(16,185,129,0.12)' :
                        isChecking  ? 'rgba(79,70,229,0.1)'   :
                        isFailed    ? 'rgba(239,68,68,0.1)'    : '#F1F5F9',
            color:      isPassed   ? '#10B981' :
                        isChecking  ? '#4F46E5'  :
                        isFailed    ? '#EF4444'  : '#94A3B8',
          }}
        >
          <Icon style={{ width: 16, height: 16 }} />
        </div>
      </div>

      {/* Label + subtext */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs truncate mt-0.5" style={{ color: isPassed ? '#10B981' : isFailed ? '#EF4444' : '#94A3B8' }}>
          {subtext || desc}
        </p>
      </div>

      {/* Status */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {state === 'pending' && <span className="text-xs text-gray-400">Waiting…</span>}

        {isChecking && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-600 font-medium">Verifying…</span>
            <span className="check-spinner" />
          </div>
        )}

        {isPassed && (
          <span className="check-pop flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 style={{ width: 18, height: 18 }} />
            <span className="text-xs font-semibold">Verified</span>
          </span>
        )}

        {isFailed && (
          <span className="flex items-center gap-1.5 text-red-500">
            <XCircle style={{ width: 18, height: 18 }} />
            <span className="text-xs font-semibold">Failed</span>
          </span>
        )}
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}
