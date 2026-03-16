import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { STUDENT_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useSkills(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.SKILLS,
    queryFn: () => api.get(STUDENT_URLS.SKILLS),
    ...options,
  });
}
