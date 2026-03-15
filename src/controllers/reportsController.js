import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useReports(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS,
    queryFn: () => api.get(STUDENT_URLS.REPORTS),
    ...options,
  });
}
