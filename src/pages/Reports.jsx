import { useState } from 'react';
import ReportTypeCard from '../components/reports/ReportTypeCard';
import ExportOptions from '../components/reports/ExportOptions';
import ReportPreview from '../components/reports/ReportPreview';

export default function Reports() {
  const [selected, setSelected] = useState('comprehensive');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-gray-900">Reports</h2>
        <p className="text-gray-500 text-sm mt-1">Download and share your employability assessment reports</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Left column */}
        <div className="space-y-4">
          <ReportTypeCard
            title="Comprehensive Report"
            description="Full analysis across all psychometric dimensions — aptitude, technical, behavioral, and communication with trend data."
            pages={12}
            sections={8}
            active={selected === 'comprehensive'}
            onClick={() => setSelected('comprehensive')}
          />
          <ReportTypeCard
            title="Placement Report"
            description="Optimized for placement cells — includes skill matrix, percentile ranking, growth proof, and interview readiness score."
            pages={4}
            sections={4}
            badge="Placement Ready"
            active={selected === 'placement'}
            onClick={() => setSelected('placement')}
          />
          <ExportOptions />
        </div>

        {/* Right column */}
        <ReportPreview />
      </div>
    </div>
  );
}
