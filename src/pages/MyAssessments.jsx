import { useState } from 'react';
import { ClipboardList, GitCompare } from 'lucide-react';
import AssessmentStats from '../components/assessments/AssessmentStats';
import AssessmentFilters from '../components/assessments/AssessmentFilters';
import AssessmentCard from '../components/assessments/AssessmentCard';
import { assessments } from '../data/mockData';

export default function MyAssessments() {
  const [filtered, setFiltered] = useState(assessments);

  function handleFilter(cat) {
    if (cat === 'All') setFiltered(assessments);
    else setFiltered(assessments.filter(a => a.category === cat));
  }

  function handleSearch(q) {
    const lower = q.toLowerCase();
    setFiltered(assessments.filter(a => a.title.toLowerCase().includes(lower)));
  }

  function handleSort(by) {
    const copy = [...filtered];
    if (by === 'Score')      copy.sort((a, b) => b.score - a.score);
    else if (by === 'Percentile') copy.sort((a, b) => b.percentile - a.percentile);
    else copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFiltered(copy);
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-gray-900">Assessment History</h2>
          <p className="text-gray-500 text-sm mt-1">All {assessments.length} attempts — track your progress over time</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <GitCompare className="w-4 h-4" /> Compare View
          </button>
          <button className="btn-primary">
            <ClipboardList className="w-4 h-4" /> New Assessment
          </button>
        </div>
      </div>

      <AssessmentStats />
      <AssessmentFilters onFilter={handleFilter} onSearch={handleSearch} onSort={handleSort} />

      {/* List */}
      <div className="space-y-3">
        {filtered.map((a, i) => (
          <AssessmentCard key={a.id} assessment={a} delay={i * 60} />
        ))}
        {filtered.length === 0 && (
          <div className="card p-10 text-center text-gray-400">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No assessments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
