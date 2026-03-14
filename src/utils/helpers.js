export function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-500';
}

export function getScoreBg(score) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Strong';
  if (score >= 65) return 'Good';
  return 'Needs Work';
}

export function getScoreLabelColor(label) {
  const map = {
    'Excellent': 'text-emerald-600 bg-emerald-50',
    'Strong': 'text-blue-600 bg-blue-50',
    'Good': 'text-amber-600 bg-amber-50',
    'Needs Work': 'text-red-500 bg-red-50',
  };
  return map[label] || 'text-gray-600 bg-gray-50';
}

export function getCategoryClass(cat) {
  const map = {
    'Technical': 'badge-technical',
    'Aptitude': 'badge-aptitude',
    'Behavioral': 'badge-behavioral',
    'Communication': 'badge-communication',
  };
  return map[cat] || 'bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full';
}

export function getCategoryColor(cat) {
  const map = {
    'Technical': '#3B82F6',
    'Aptitude': '#10B981',
    'Behavioral': '#8B5CF6',
    'Communication': '#F59E0B',
    'Overall': '#6366F1',
  };
  return map[cat] || '#64748B';
}

export function getPriorityClass(p) {
  if (p === 'High')   return 'bg-red-100 text-red-700';
  if (p === 'Medium') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-600';
}

export function getStatusIcon(status) {
  if (status === 'done')        return '✅';
  if (status === 'in-progress') return '🔄';
  if (status === 'active')      return '🟢';
  return '⚪';
}

export function getInitialColor(cat) {
  const map = {
    'Technical': 'bg-blue-100 text-blue-700',
    'Aptitude': 'bg-emerald-100 text-emerald-700',
    'Behavioral': 'bg-violet-100 text-violet-700',
    'Communication': 'bg-amber-100 text-amber-700',
  };
  return map[cat] || 'bg-gray-100 text-gray-600';
}

export function getCategoryInitial(cat) {
  const map = {
    'Technical': 'T',
    'Aptitude': 'A',
    'Behavioral': 'B',
    'Communication': 'C',
  };
  return map[cat] || '?';
}
