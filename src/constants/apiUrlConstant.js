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
  GET_STUDENT_PROFILE:     (id) => `/api/v1/student/${id}`,
  GET_TIMELINE:            (id) => `/api/v1/student/${id}/timeline`,
  GET_TOPIC_MASTERY:       (id) => `/api/v1/student/${id}/topic-mastery`,
  GET_BEHAVIOR_RADAR:      (id) => `/api/v1/student/${id}/behavioral-radar`,
  GET_ASSESSMENT_HISTORY:  (id) => `/api/v1/student/${id}/assessment-history`,
  GET_PEER_BENCHMARK:      (id) => `/api/v1/student/${id}/peer-benchmark`,
  GET_SKILL_HEATMAP:       (id) => `/api/v1/student/${id}/skill-heatmap`,
  GET_STRENGTH_WEAKNESS:   (id) => `/api/v1/student/${id}/strengths-weaknesses`,
  GET_COMPARISON:          (id) => `/api/v1/student/${id}/comparison`,
  GET_PLACEMENTS:          (id) => `/api/v1/student/${id}/placements`,
  GET_RECOMMENDATIONS:     (id) => `/api/v1/student/${id}/recommendations`,
  GET_IMPROVEMENT_PLAN:    (id) => `/api/v1/student/${id}/improvement-plan`,
  UPDATE_IMPROVEMENT_PLAN: (id, actionId) => `/api/v1/student/${id}/improvement-plan/${actionId}`,
  GET_MILESTONES:          (id) => `/api/v1/student/${id}/milestones`,
};

// ── Cycles & Attempts ─────────────────────────────────────────────────────────
export const CYCLE_URLS = {
  STUDENT_CYCLES:    '/api/v1/assessments/student/cycles',
  GET:               (id)        => `/api/v1/assessments/cycles/${id}`,
  RESULTS:           (id)        => `/api/v1/assessments/cycles/${id}/results`,
  LEADERBOARD:       (id)        => `/api/v1/assessments/cycles/${id}/leaderboard`,
  START_ATTEMPT:     (cycleId)   => `/api/v1/assessments/cycles/${cycleId}/start`,
  SUBMIT_ATTEMPT:    (attemptId) => `/api/v1/assessments/attempts/${attemptId}/submit`,
  ATTEMPT_QUESTIONS: (attemptId) => `/api/v1/assessments/attempts/${attemptId}/questions`,
  ATTEMPT_RESULTS:   (attemptId) => `/api/v1/assessments/attempts/${attemptId}/results`,
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const NOTIFICATION_URLS = {
  INBOX:         '/api/v1/notification/inbox',
  MARK_READ:     (id) => `/api/v1/notification/${id}/read`,
  MARK_ALL_READ: '/api/v1/notification/read-all',
  DELETE:        (id) => `/api/v1/notification/${id}`,
  DELETE_ALL:    '/api/v1/notification',
};

// ── TanStack Query cache keys ─────────────────────────────────────────────────
export const QUERY_KEYS = {
  STUDENT_CYCLES:    ['student-cycles'],
  CYCLE:             (id) => ['cycle', id],
  ATTEMPT_QUESTIONS: (id) => ['attempt-questions', id],
  ATTEMPT_RESULTS:   (id) => ['attempt-results', id],
  NOTIFICATIONS:     ['notifications'],
};
