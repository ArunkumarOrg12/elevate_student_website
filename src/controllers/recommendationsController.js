import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useRecommendations(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.RECOMMENDATIONS,
    queryFn: () => api.get(STUDENT_URLS.RECOMMENDATIONS),
    ...options,
  });
}
