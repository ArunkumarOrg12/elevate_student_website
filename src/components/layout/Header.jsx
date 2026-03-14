import { Menu, Bell, ChevronDown } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { student } from '../../data/mockData';

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

      {/* Right: bell + profile */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Notification bell */}
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-white"></span>
        </button>

        {/* Divider */}
        <span className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors group">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm shadow-indigo-200">
            {student.initials}
          </div>

          {/* Name + badge — hidden on mobile */}
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[110px]">
              {student.name}
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-1.5 py-px rounded-full border border-emerald-200 leading-none mt-0.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block"></span>
              {student.year}
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
