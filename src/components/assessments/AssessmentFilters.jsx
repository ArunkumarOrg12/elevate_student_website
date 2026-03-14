import { useState } from 'react';
import { Search } from 'lucide-react';

const CATS = ['All', 'Technical', 'Aptitude', 'Behavioral', 'Communication'];
const COUNTS = { All: 10, Technical: 4, Aptitude: 3, Behavioral: 2, Communication: 1 };
const SORTS = ['Date', 'Score', 'Percentile'];

export default function AssessmentFilters({ onFilter, onSort, onSearch }) {
  const [active, setActive] = useState('All');
  const [sort, setSort] = useState('Date');
  const [query, setQuery] = useState('');

  function setCategory(c) {
    setActive(c);
    onFilter?.(c);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
      {/* Category tabs */}
      <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-0.5 overflow-x-auto">
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap transition-all ${
              active === c
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {c} ({COUNTS[c]})
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap ml-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={query}
            onChange={e => { setQuery(e.target.value); onSearch?.(e.target.value); }}
            className="pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-300 w-44"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-0.5">
          {SORTS.map(s => (
            <button
              key={s}
              onClick={() => { setSort(s); onSort?.(s); }}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all ${
                sort === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
