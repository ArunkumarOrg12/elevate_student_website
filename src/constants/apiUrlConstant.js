// ── Base ─────────────────────────────────────────────────────────────────────
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const AUTH_URLS = {
  STUDENT_LOGIN:  '/api/v1/auth/student-login',
  LOGOUT:         '/api/v1/auth/logout',
  REFRESH_TOKEN:  '/api/v1/auth/refresh-token',
};

// ── Student ───────────────────────────────────────────────────────────────────
export const STUDENT_URLS = {
  PROFILE:         '/api/v1/student/profile',
  DASHBOARD:       '/api/v1/student/dashboard',
  ASSESSMENTS:     '/api/v1/student/assessments',
  SKILLS:          '/api/v1/student/skills',
  GROWTH:          '/api/v1/student/growth',
  RECOMMENDATIONS: '/api/v1/student/recommendations',
  REPORTS:         '/api/v1/student/reports',
};

// ── TanStack Query cache keys ─────────────────────────────────────────────────
export const QUERY_KEYS = {
  PROFILE:         ['profile'],
  DASHBOARD:       ['dashboard'],
  ASSESSMENTS:     ['assessments'],
  SKILLS:          ['skills'],
  GROWTH:          ['growth'],
  RECOMMENDATIONS: ['recommendations'],
  REPORTS:         ['reports'],
};
