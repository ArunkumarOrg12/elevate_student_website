import { Download, Printer, Share2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExportOptions() {
  return (
    <div className="card p-5">
      <h4 className="font-display font-semibold text-gray-800 mb-4">Export Options</h4>
      <div className="flex flex-col gap-2">
        <Button variant="default" className="justify-center w-full py-3 text-sm">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" className="justify-center text-xs px-2 py-2">
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button variant="secondary" className="justify-center text-xs px-2 py-2">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button variant="secondary" className="justify-center text-xs px-2 py-2">
            <Database className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
