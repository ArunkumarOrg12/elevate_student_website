import { useState, useEffect } from 'react';
import { Edit2, Info } from 'lucide-react';
import { useStudentProfile } from '../../controllers/studentController';
import { useAuth } from '../../context/AuthContext';
import { student as mockStudent } from '../../data/mockData';

const FIELDS = [
  { label: 'Full Name',             key: 'name',    editable: true  },
  { label: 'Email Address',         key: 'email',   editable: true  },
  { label: 'Branch / Program',      key: 'branch',  editable: false },
  { label: 'College / Institution', key: 'college', editable: false },
  { label: 'Academic Batch',        key: 'batch',   editable: false },
  { label: 'CGPA',                  key: 'cgpa',    editable: true  },
  { label: 'Phone Number',          key: 'phone',   editable: true  },
];

function buildFormFromProfile(profileData, authUser) {
  if (!profileData) {
    return {
      name:    authUser ? `${authUser.first_name ?? ''} ${authUser.last_name ?? ''}`.trim() : mockStudent.name,
      email:   authUser?.email ?? mockStudent.email,
      branch:  mockStudent.branch,
      college: mockStudent.college,
      batch:   mockStudent.batch,
      cgpa:    mockStudent.cgpa,
      phone:   mockStudent.phone,
    };
  }
  // Backend shape: { id, first_name, last_name, email, college_id, student: { enrollment_number, batch_year, department: {id,name,code}, program: {id,name,code} } }
  const s = profileData.student ?? {};
  const batchYear = s.batch_year;
  return {
    name:    `${profileData.first_name ?? ''} ${profileData.last_name ?? ''}`.trim() || mockStudent.name,
    email:   profileData.email ?? mockStudent.email,
    branch:  s.department?.name ?? mockStudent.branch,
    college: s.program?.name ? `${s.program.name} — ${mockStudent.college}` : mockStudent.college,
    batch:   batchYear ? `${batchYear}–${batchYear + 4}` : mockStudent.batch,
    cgpa:    s.cgpa != null ? String(s.cgpa) : mockStudent.cgpa,
    phone:   profileData.phone ?? mockStudent.phone,
  };
}

export default function ProfileForm() {
  const { user: authUser } = useAuth();
  const { data: profileData, isLoading } = useStudentProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildFormFromProfile(null, authUser));

  useEffect(() => {
    if (profileData) {
      setForm(buildFormFromProfile(profileData, authUser));
    }
  }, [profileData, authUser]);

  if (isLoading) {
    return <div className="card p-6 h-64 animate-pulse bg-gray-50" />;
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-base text-gray-800">Profile Information</h3>
        <button
          className={editing ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setEditing(e => !e)}
        >
          <Edit2 className="w-3.5 h-3.5" />
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {FIELDS.map(f => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <label htmlFor={f.key} className="text-xs font-medium text-gray-600">{f.label}</label>
            {editing && f.editable ? (
              <input
                id={f.key}
                type="text"
                value={form[f.key]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                className="px-3 py-2.5 rounded-xl text-sm bg-white border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            ) : (
              <div
                className={`px-3 py-2.5 rounded-xl text-sm ${
                  f.editable
                    ? 'bg-gray-50 text-gray-800 border border-gray-100'
                    : 'bg-gray-100 text-gray-500 border border-transparent'
                }`}
              >
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
