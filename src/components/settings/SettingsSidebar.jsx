import { User, Bell, Lock, Sliders, Download } from 'lucide-react';
import { useStudentProfile } from '../../controllers/studentController';
import { useAuth } from '../../context/AuthContext';
import { student as mockStudent } from '../../data/mockData';

const TABS = [
  { key: 'profile',       label: 'Profile',        Icon: User    },
  { key: 'notifications', label: 'Notifications',   Icon: Bell    },
  { key: 'privacy',       label: 'Privacy',         Icon: Lock    },
  { key: 'preferences',   label: 'Preferences',     Icon: Sliders },
];

export default function SettingsSidebar({ active, onChange }) {
  const { user: authUser } = useAuth();
  const { data: profileData } = useStudentProfile();

  const firstName = profileData?.first_name ?? authUser?.first_name ?? mockStudent.firstName;
  const lastName  = profileData?.last_name  ?? authUser?.last_name  ?? '';
  const name      = `${firstName} ${lastName}`.trim() || mockStudent.name;
  const initials  = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || mockStudent.initials;
  const branch    = profileData?.student?.department?.name ?? mockStudent.branch;
  const studentId = profileData?.student?.enrollment_number ?? mockStudent.id;

  return (
    <div className="card p-5 flex flex-col gap-5">
      {/* User */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-display font-bold text-xl mb-3">
          {initials}
        </div>
        <p className="font-display font-bold text-gray-900">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{branch}</p>
        <p className="text-xs text-gray-400">{studentId}</p>
      </div>

      {/* Tabs */}
      <nav className="space-y-1">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === key
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-4">
        <button className="flex items-center gap-2 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export All Data
        </button>
      </div>
    </div>
  );
}
