import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssessmentFlowProvider } from './context/AssessmentFlowContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import MyAssessments from './pages/MyAssessments';
import SkillInsights from './pages/SkillInsights';
import GrowthTimeline from './pages/GrowthTimeline';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import AssessmentRegister from './pages/AssessmentRegister';
import AssessmentOverview from './pages/AssessmentOverview';
import AssessmentSecurityCheck from './pages/AssessmentSecurityCheck';
import AssessmentExam from './pages/AssessmentExam';
import AssessmentComplete from './pages/AssessmentComplete';

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
                <AssessmentFlowProvider>
                  <SidebarProvider><AppShell /></SidebarProvider>
                </AssessmentFlowProvider>
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
            <Route path="assessment/register"       element={<AssessmentRegister />} />
            <Route path="assessment/overview"       element={<AssessmentOverview />} />
            <Route path="assessment/security-check" element={<AssessmentSecurityCheck />} />
            <Route path="assessment/exam"           element={<AssessmentExam />} />
            <Route path="assessment/complete"       element={<AssessmentComplete />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
