import { useState } from 'react';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import ProfileForm from '../components/settings/ProfileForm';

export default function Settings() {
  const [tab, setTab] = useState('profile');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-5 items-start">
        <SettingsSidebar active={tab} onChange={setTab} />
        <div>
          {tab === 'profile' && <ProfileForm />}
          {tab !== 'profile' && (
            <div className="card p-10 text-center text-gray-400">
              <p className="font-medium capitalize">{tab} settings coming soon</p>
              <p className="text-xs mt-1">This section is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
