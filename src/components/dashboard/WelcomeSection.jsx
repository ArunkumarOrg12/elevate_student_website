import { ClipboardList, FileText, CheckCircle } from 'lucide-react';
import { student } from '../../data/mockData';

export default function WelcomeSection() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            Welcome back, {student.firstName} 👋
          </h2>
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            {student.status}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1.5">
          {student.college} · {student.batch} · Updated {student.updatedAt}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="btn-primary">
          <ClipboardList className="w-4 h-4" />
          Take Assessment
        </button>
        <button className="btn-secondary">
          <FileText className="w-4 h-4" />
          View Report
        </button>
      </div>
    </div>
  );
}
