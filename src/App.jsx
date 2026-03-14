import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import MyAssessments from './pages/MyAssessments';
import SkillInsights from './pages/SkillInsights';
import GrowthTimeline from './pages/GrowthTimeline';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';

// Blocks unauthenticated access; shows nothing while session restore is in-flight
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // brief blank while refresh cookie is validated
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/sign-in" element={<SignIn />} />

          {/* Protected shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SidebarProvider><AppShell /></SidebarProvider>
              </ProtectedRoute>
            }
          >
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
      </AuthProvider>
    </BrowserRouter>
  );
}
