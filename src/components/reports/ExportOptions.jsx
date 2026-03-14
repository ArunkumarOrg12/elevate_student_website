import { Download, Printer, Share2, Database } from 'lucide-react';

export default function ExportOptions() {
  return (
    <div className="card p-5">
      <h4 className="font-display font-semibold text-gray-800 mb-4">Export Options</h4>
      <div className="flex flex-col gap-2">
        <button className="btn-primary justify-center text-sm py-3">
          <Download className="w-4 h-4" /> Download PDF
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button className="btn-secondary justify-center text-xs px-2 py-2">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button className="btn-secondary justify-center text-xs px-2 py-2">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="btn-secondary justify-center text-xs px-2 py-2">
            <Database className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>
    </div>
  );
}
