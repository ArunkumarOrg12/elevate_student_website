const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export default function LikertQuestion({ question, value, onChange }) {
  return (
    <div className="space-y-5">
      <div className="card p-5 md:p-6">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
          Statement
        </p>
        <p className="text-base md:text-lg text-gray-800 font-medium leading-relaxed">
          {question.question_text || question.question || ''}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-between">
        {LIKERT_OPTIONS.map((opt) => {
          const sel = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="flex-1 min-w-[90px] flex flex-col items-center gap-2 rounded-xl p-3 md:p-4 text-center transition-all duration-150 hover:scale-[1.02]"
              style={{
                background:   sel ? '#EEF2FF' : '#FFFFFF',
                border:       sel ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                boxShadow:    sel ? '0 0 0 3px rgba(79,70,229,0.08)' : undefined,
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: sel ? '#4F46E5' : '#F1F5F9',
                  color:      sel ? '#FFF'    : '#64748B',
                }}
              >
                {opt.value}
              </span>
              <span className="text-xs font-medium leading-snug" style={{ color: sel ? '#4F46E5' : '#64748B' }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
