import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import MyAssessments from './pages/MyAssessments';
import SkillInsights from './pages/SkillInsights';
import GrowthTimeline from './pages/GrowthTimeline';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"       element={<Dashboard />} />
            <Route path="assessments"     element={<MyAssessments />} />
            <Route path="skill-insights"  element={<SkillInsights />} />
            <Route path="growth-timeline" element={<GrowthTimeline />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="reports"         element={<Reports />} />
            <Route path="settings"        element={<Settings />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}
