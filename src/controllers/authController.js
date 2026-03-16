import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { AUTH_URLS } from '../constants/apiUrlConstant';

// ── Login ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: (credentials) => api.post(AUTH_URLS.STUDENT_LOGIN, credentials),
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function useLogout() {
  return useMutation({
    mutationFn: () => api.post(AUTH_URLS.LOGOUT),
  });
}

// ── Refresh token ─────────────────────────────────────────────────────────────
export function useRefreshToken() {
  return useMutation({
    mutationFn: () => api.post(AUTH_URLS.REFRESH_TOKEN),
  });
}
