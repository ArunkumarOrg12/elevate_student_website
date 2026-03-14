import { useState } from 'react';
import { Edit2, Info } from 'lucide-react';
import { student } from '../../data/mockData';

const FIELDS = [
  { label: 'Full Name',             key: 'name',    editable: true  },
  { label: 'Email Address',         key: 'email',   editable: true  },
  { label: 'Branch / Program',      key: 'branch',  editable: false },
  { label: 'College / Institution', key: 'college', editable: false },
  { label: 'Academic Batch',        key: 'batch',   editable: false },
  { label: 'CGPA',                  key: 'cgpa',    editable: true  },
  { label: 'Phone Number',          key: 'phone',   editable: true  },
];

export default function ProfileForm() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: student.name,
    email: student.email,
    branch: student.branch,
    college: student.college,
    batch: student.batch,
    cgpa: student.cgpa,
    phone: student.phone,
  });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-base text-gray-800">Profile Information</h3>
        <button
          onClick={() => setEditing(e => !e)}
          className={editing ? 'btn-primary' : 'btn-secondary'}
        >
          <Edit2 className="w-3.5 h-3.5" />
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{f.label}</label>
            {editing && f.editable ? (
              <input
                type="text"
                value={form[f.key]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
              />
            ) : (
              <div className={`px-3 py-2.5 rounded-xl text-sm ${f.editable ? 'bg-gray-50 text-gray-800 border border-gray-100' : 'bg-gray-100 text-gray-500 border border-transparent'}`}>
                {form[f.key]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          Some fields like Student ID and batch are managed by your institution and cannot be edited. Contact your academic mentor for changes.
        </p>
      </div>
    </div>
  );
}
