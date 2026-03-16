import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useDashboard(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: () => api.get(STUDENT_URLS.DASHBOARD),
    ...options,
  });
}
