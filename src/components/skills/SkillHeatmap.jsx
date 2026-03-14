import { skillHeatmap } from '../../data/mockData';

function heatColor(v) {
  // 30–100 → light to dark teal
  const t = (v - 30) / 70;
  const r = Math.round(219 - t * 150);
  const g = Math.round(234 - t * 70);
  const b = Math.round(254 - t * 130);
  return `rgb(${r},${g},${b})`;
}

function textColor(v) {
  return v > 70 ? '#1E3A5F' : '#334155';
}

export default function SkillHeatmap() {
  const { categories, semesters, data } = skillHeatmap;
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-base text-gray-800 mb-1">Skill Heatmap</h3>
      <p className="text-xs text-gray-400 mb-4">Score by category over semesters</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-medium pb-2 pr-3 w-28">Category</th>
              {semesters.map(s => (
                <th key={s} className="text-center text-gray-400 font-medium pb-2 px-1">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, ci) => (
              <tr key={cat}>
                <td className="text-gray-600 font-medium py-1 pr-3">{cat}</td>
                {data[ci].map((v, si) => (
                  <td key={si} className="py-1 px-1 text-center">
                    <div
                      className="rounded-lg w-10 h-8 flex items-center justify-center mx-auto font-bold"
                      style={{ background: heatColor(v), color: textColor(v) }}
                    >
                      {v}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-gray-400">Low</span>
          <div className="flex h-2 rounded-full overflow-hidden flex-1 max-w-24">
            {[35,50,65,80,95].map(v => (
              <div key={v} className="flex-1" style={{ background: heatColor(v) }} />
            ))}
          </div>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>
    </div>
  );
}
