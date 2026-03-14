import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileDrawer from './MobileDrawer';
import { useSidebar } from '../../context/SidebarContext';

export default function AppShell() {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0 shadow-sidebar">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <MobileDrawer />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
