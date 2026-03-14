import { Menu, Bell, Search } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

export default function Header() {
  const { openMobile } = useSidebar();

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

      {/* Right: notification */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
