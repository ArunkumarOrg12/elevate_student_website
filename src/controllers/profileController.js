import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useProfile(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => api.get(STUDENT_URLS.PROFILE),
    ...options,
  });
}
