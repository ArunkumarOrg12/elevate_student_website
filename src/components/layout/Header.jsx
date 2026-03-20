import { useEffect, useRef, useState } from 'react';
import { Menu, Bell, ChevronDown, Check, CheckCheck, Inbox, Trash2, X } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { student } from '../../data/mockData';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '../../controllers/notificationController';

/* ── helpers ─────────────────────────────────────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── NotificationItem ────────────────────────────────────────────────────── */
function NotificationItem({ notification, onRead, onDelete }) {
  const isUnread = !notification.is_read;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group ${
        isUnread ? 'bg-indigo-50/60' : ''
      }`}
      onClick={() => isUnread && onRead(notification.id)}
    >
      {/* Unread dot */}
      <span
        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 transition-all ${
          isUnread ? 'bg-indigo-500' : 'bg-transparent'
        }`}
      />

      {/* Body */}
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className={`text-sm leading-snug truncate ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
            {notification.title}
          </p>
        )}
        <p className={`text-xs leading-relaxed ${isUnread ? 'text-gray-700' : 'text-gray-500'} mt-0.5`}>
          {notification.message || notification.body || ''}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notification.created_at)}</p>
      </div>

      {/* Hover action buttons */}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0 mt-0.5 transition-all">
        {/* Mark-read tick — only for unread */}
        {isUnread && (
          <button
            className="p-1 rounded-full hover:bg-indigo-100 text-indigo-500 transition-colors"
            title="Mark as read"
            onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
          >
            <Check style={{ width: 12, height: 12 }} />
          </button>
        )}
        {/* Delete */}
        <button
          className="p-1 rounded-full hover:bg-red-100 text-gray-300 hover:text-red-500 transition-colors"
          title="Delete notification"
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
        >
          <Trash2 style={{ width: 12, height: 12 }} />
        </button>
      </div>
    </div>
  );
}

/* ── NotificationDropdown ────────────────────────────────────────────────── */
function NotificationDropdown({ onClose }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const { data, isLoading, isError } = useNotifications({ refetchOnWindowFocus: true });
  const markRead       = useMarkNotificationRead();
  const markAllRead    = useMarkAllNotificationsRead();
  const deleteOne      = useDeleteNotification();
  const deleteAll      = useDeleteAllNotifications();

  function handleClearAll() {
    if (!confirmClear) { setConfirmClear(true); return; }
    deleteAll.mutate(undefined, { onSuccess: () => setConfirmClear(false) });
  }

  // Normalise — backend may return { notifications: [...] } or a plain array
  const notifications = Array.isArray(data)
    ? data
    : Array.isArray(data?.notifications)
    ? data.notifications
    : [];

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
      style={{ boxShadow: '0 8px 32px -4px rgba(0,0,0,0.14)' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-sm text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              title="Mark all as read"
            >
              <CheckCheck style={{ width: 13, height: 13 }} />
              All read
            </button>
          )}
          <button
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Loading…</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs text-red-400">Failed to load notifications.</p>
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Inbox className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-gray-400 font-medium">All caught up!</p>
            <p className="text-xs text-gray-300">No notifications yet.</p>
          </div>
        )}

        {!isLoading && notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onRead={(id) => markRead.mutate(id)}
            onDelete={(id) => deleteOne.mutate(id)}
          />
        ))}
      </div>

      {/* Footer — clear-all */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            {unreadCount === 0
              ? 'All notifications read'
              : `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
          </p>
          <button
            id="clear-all-notifications-btn"
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ${
              confirmClear
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'text-red-400 hover:text-red-600 hover:bg-red-50'
            }`}
            onClick={handleClearAll}
            onBlur={() => setConfirmClear(false)}
            disabled={deleteAll.isPending}
            title="Clear all notifications"
          >
            <Trash2 style={{ width: 11, height: 11 }} />
            {confirmClear ? 'Confirm clear' : 'Clear all'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────────────────────── */
export default function Header() {
  const { openMobile } = useSidebar();
  const { user: authUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);

  // Derive display values from real auth user; fall back to mock while offline
  const displayUser = authUser
    ? {
        initials: `${authUser.first_name?.[0] ?? ''}${authUser.last_name?.[0] ?? ''}`.toUpperCase(),
        name: `${authUser.first_name ?? ''} ${authUser.last_name ?? ''}`.trim(),
        year: student.year,
      }
    : { initials: student.initials, name: student.name, year: student.year };

  // Fetch notifications to drive the unread badge count
  const { data } = useNotifications({ refetchInterval: 60_000 });
  const notifications = Array.isArray(data)
    ? data
    : Array.isArray(data?.notifications)
    ? data.notifications
    : [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close dropdown on outside click
  useEffect(() => {
    if (!showNotifications) return;
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifications]);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6 gap-4 shadow-sm">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        onClick={openMobile}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Title block */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-gray-900 text-sm md:text-base truncate leading-tight">
          Student Employability Intelligence Portal
        </h1>
        <p className="text-xs text-gray-500 hidden sm:block truncate">
          Track your progress, identify strengths, and accelerate your career readiness
        </p>
      </div>

      {/* Right: bell + profile */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Notification bell */}
        <div className="relative" ref={bellRef}>
          <button
            id="notification-bell-btn"
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Open notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white" />
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Divider */}
        <span className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors group">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm shadow-indigo-200">
            {displayUser.initials}
          </div>

          {/* Name + badge — hidden on mobile */}
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[110px]">
              {displayUser.name}
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-1.5 py-px rounded-full border border-emerald-200 leading-none mt-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
              {displayUser.year}
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown
            className="hidden sm:block text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0"
            style={{ width: 14, height: 14 }}
          />
        </button>
      </div>
    </header>
  );
}
