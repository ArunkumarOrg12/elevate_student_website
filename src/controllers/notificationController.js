import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { NOTIFICATION_URLS, QUERY_KEYS } from '../constants/apiUrlConstant';

export function useNotifications(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: () => api.get(NOTIFICATION_URLS.INBOX),
    ...options,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(NOTIFICATION_URLS.MARK_READ(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch(NOTIFICATION_URLS.MARK_ALL_READ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(NOTIFICATION_URLS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete(NOTIFICATION_URLS.DELETE_ALL),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
}
