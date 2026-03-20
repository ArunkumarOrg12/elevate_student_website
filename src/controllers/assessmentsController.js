import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, CYCLE_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useAssessments(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ASSESSMENTS,
    queryFn: () => api.get(STUDENT_URLS.ASSESSMENTS),
    ...options,
  });
}

export function useStudentCycles(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDENT_CYCLES,
    queryFn: () => api.get(CYCLE_URLS.STUDENT_CYCLES),
    ...options,
  });
}

export function useAttemptQuestions(attemptId, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ATTEMPT_QUESTIONS(attemptId),
    queryFn: () => api.get(CYCLE_URLS.ATTEMPT_QUESTIONS(attemptId)),
    enabled: !!attemptId,
    ...options,
  });
}

export function useAttemptResults(attemptId, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ATTEMPT_RESULTS(attemptId),
    queryFn: () => api.get(CYCLE_URLS.ATTEMPT_RESULTS(attemptId)),
    enabled: !!attemptId,
    ...options,
  });
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: (cycleId) => api.post(CYCLE_URLS.START_ATTEMPT(cycleId)),
  });
}

export function useSubmitAttempt() {
  return useMutation({
    mutationFn: ({ attemptId, answers }) =>
      api.post(CYCLE_URLS.SUBMIT_ATTEMPT(attemptId), { answers }),
  });
}
