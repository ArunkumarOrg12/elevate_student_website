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
  GET_STUDENT_PROFILE: (id) => `/api/v1/student/${id}`,
  GET_TIMELINE: (id) => `/api/v1/student/${id}/timeline`,
  GET_TOPIC_MASTERY: (id) => `/api/v1/student/${id}/topic-mastery`,
  GET_BEHAVIOR_RADAR: (id) => `/api/v1/student/${id}/behavioral-radar`,
  GET_ASSESSMENT_HISTORY: (id) => `/api/v1/student/${id}/assessment-history`,
  GET_PEER_BENCHMARK: (id) => `/api/v1/student/${id}/peer-benchmark`,
  GET_STRENGTH_WEAKNESS: (id) => `/api/v1/student/${id}/strengths-weaknesses`,
  GET_COMPARISON: (id) => `/api/v1/student/${id}/comparison`,
  GET_PLACEMENTS: (id) => `/api/v1/student/${id}/placements`,
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

// constants/apiUrlConstant.ts

