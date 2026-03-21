import { useState } from 'react';

const MAX_LENGTH = 1000;

export default function DescriptiveQuestion({ question, value, onChange }) {
  const text = value ?? '';

  return (
    <div className="space-y-4">
      <div className="card p-5 md:p-6">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
          Question
        </p>
        <p className="text-base md:text-lg text-gray-800 font-medium leading-relaxed">
          {question.question_text || question.question || ''}
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          rows={6}
          maxLength={MAX_LENGTH}
          placeholder="Type your answer here..."
          value={text}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          style={{ background: '#FFFFFF' }}
        />
        <p className="text-xs text-gray-400 text-right font-medium">
          {text.length} / {MAX_LENGTH}
        </p>
      </div>
    </div>
  );
}
