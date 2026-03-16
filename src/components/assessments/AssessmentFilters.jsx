import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATS = ['All', 'Technical', 'Aptitude', 'Behavioral', 'Communication'];
const COUNTS = { All: 10, Technical: 4, Aptitude: 3, Behavioral: 2, Communication: 1 };
const SORTS = [
  { value: 'date',       label: 'Date'       },
  { value: 'score',      label: 'Score'      },
  { value: 'percentile', label: 'Percentile' },
];

export default function AssessmentFilters({ onFilter, onSort, onSearch }) {
  const [active, setActive] = useState('All');
  const [sort, setSort] = useState('date');
  const [query, setQuery] = useState('');

  function setCategory(c) {
    setActive(c);
    onFilter?.(c);
  }

  function handleSort(val) {
    setSort(val);
    onSort?.(val);
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
        {/* Search — shadcn Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search topics..."
            value={query}
            onChange={e => { setQuery(e.target.value); onSearch?.(e.target.value); }}
            className="pl-8 w-44 h-8 text-xs"
          />
        </div>

        {/* Sort — shadcn Select */}
        <Select value={sort} onValueChange={handleSort}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map(s => (
              <SelectItem key={s.value} value={s.value} className="text-xs">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
