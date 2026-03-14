import { useEffect } from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';

export default function MobileDrawer() {
  const { mobileOpen, closeMobile } = useSidebar();

  // Prevent body scroll when open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  if (!mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 drawer-overlay"
        onClick={closeMobile}
      />
      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full animate-slide-in">
        <Sidebar mobile onClose={closeMobile} />
      </div>
    </div>
  );
}
