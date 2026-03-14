import { CheckCircle, Shield } from 'lucide-react';
import { reportSections, student } from '../../data/mockData';
import { getScoreBg, getScoreLabelColor } from '../../utils/helpers';

const stats = [
  { label: 'Employability Index', value: '78/100' },
  { label: 'Percentile Rank',     value: '82th' },
  { label: 'Growth Rate',         value: '+4.2/sem' },
  { label: 'Risk Level',          value: 'Low' },
];

export default function ReportPreview() {
  return (
    <div className="card p-6 flex flex-col gap-5">
      <div>
        <h3 className="font-display font-semibold text-base text-gray-800 mb-4">Report Preview</h3>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="stat-number text-lg text-indigo-700">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-gray-700 mb-3">Section-Wise Performance</h4>
        <div className="space-y-3">
          {reportSections.map(s => (
            <div key={s.category}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-700">{s.category}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreLabelColor(s.label)}`}>
                    {s.label}
                  </span>
                  <span className="text-emerald-600 font-semibold">+{s.change}</span>
                  <span className="font-bold text-gray-800">{s.score}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${getScoreBg(s.score)} transition-all duration-700`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          <p className="text-xs font-semibold text-gray-600">Certified by EmployIQ Assessment Platform</p>
        </div>
        <p className="text-xs text-gray-400">Authorized by {student.mentor}, Academic Mentor</p>
        <div className="flex items-center gap-1.5 mt-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs text-emerald-600 font-semibold">Verified · Report ID: EIQ-2026-ARJ-4892</span>
        </div>
      </div>
    </div>
  );
}
