import { FileText, CheckCircle } from 'lucide-react';

export default function ReportTypeCard({ title, description, pages, sections, badge, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card p-5 cursor-pointer transition-all duration-200 ${active ? 'ring-2 ring-indigo-500 border-indigo-200' : 'hover:border-indigo-100'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-display font-semibold text-gray-900">{title}</h4>
            {badge && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />{badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">{description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
            <span>{pages} pages</span>
            <span>·</span>
            <span>{sections} sections</span>
          </div>
        </div>
      </div>
    </div>
  );
}
