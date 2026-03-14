export default function TabGroup({ tabs, active, onChange, size = 'md' }) {
  const base = size === 'sm'
    ? 'px-3 py-1.5 text-xs rounded-md font-semibold'
    : 'px-4 py-2 text-sm rounded-lg font-semibold';

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-xl gap-0.5">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`${base} transition-all duration-200 ${
            active === tab
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
