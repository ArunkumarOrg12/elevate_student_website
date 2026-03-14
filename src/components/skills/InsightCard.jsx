import { Lightbulb } from 'lucide-react';

export default function InsightCard() {
  return (
    <div className="card p-4 border-l-4 border-l-indigo-400 bg-indigo-50/50">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <p className="font-semibold text-sm text-indigo-800 mb-1">Insight</p>
          <p className="text-sm text-indigo-700 leading-relaxed">
            Behavioral consistently leads all categories. Communication has the least improvement trajectory — prioritize it now to unlock the Employment Ready Badge.
          </p>
        </div>
      </div>
    </div>
  );
}
