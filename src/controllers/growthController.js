import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useGrowth(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.GROWTH,
    queryFn: () => api.get(STUDENT_URLS.GROWTH),
    ...options,
  });
}
