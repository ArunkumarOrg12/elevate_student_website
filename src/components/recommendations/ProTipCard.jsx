import { Lightbulb } from 'lucide-react';

export default function ProTipCard({ tip }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-1">Pro Tip</p>
          <p className="text-xs text-amber-700 leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}
