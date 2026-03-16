import { ClipboardList, FileText, CheckCircle } from 'lucide-react';
import { useStudentProfile } from '../../controllers/studentController';

export default function WelcomeSection() {
  const { data: student, isLoading } = useStudentProfile();

  if (isLoading) {
    return <div className="h-16 animate-pulse bg-gray-100 rounded-xl" />;
  }

  const fullName = `${student?.first_name ?? ''} ${student?.last_name ?? ''}`.trim() || 'Student';
  const college = student?.student?.department?.name ?? 'N/A';
  const batch = student?.student?.batch_year ?? 'Batch';
  const status = student?.is_active ? 'Active' : 'Inactive';
  const updatedAt = student?.updatedAt
    ? new Date(student.updatedAt).toLocaleDateString()
    : 'Recently';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            Welcome back, {fullName} 👋
          </h2>
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1.5">
          {college} · {batch} · Updated {updatedAt}
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