import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useAssessments(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.ASSESSMENTS,
    queryFn: () => api.get(STUDENT_URLS.ASSESSMENTS),
    ...options,
  });
}
