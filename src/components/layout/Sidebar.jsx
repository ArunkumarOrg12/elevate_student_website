import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, Lightbulb, TrendingUp,
  BookOpen, FileText, Settings, ChevronLeft, ChevronRight,
  Zap, LogOut,
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard',       label: 'Dashboard',       Icon: LayoutDashboard },
  { to: '/assessments',     label: 'My Assessments',  Icon: ClipboardList   },
  { to: '/skill-insights',  label: 'Skill Insights',  Icon: Lightbulb       },
  { to: '/growth-timeline', label: 'Growth Timeline', Icon: TrendingUp      },
  { to: '/recommendations', label: 'Recommendations', Icon: BookOpen        },
  // { to: '/reports',         label: 'Reports',         Icon: FileText        },
  { to: '/settings',        label: 'Settings',        Icon: Settings        },
];

export default function Sidebar({ mobile = false, onClose }) {
  const { collapsed, toggle } = useSidebar();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const col = mobile ? false : collapsed;

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in', { replace: true });
  };

  return (
    <aside
      className="sidebar-transition flex flex-col h-full bg-[#1E293B] text-slate-300 relative"
      style={{ width: mobile ? 260 : (col ? 72 : 260) }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/60 ${col && !mobile ? 'justify-center px-2' : ''}`}>
        <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
          {/* <Zap className="w-5 h-5 text-white" /> */}
          <img src="./Logo whitevector.png" alt="logo" />
        </div>
        {(!col || mobile) && (
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-base leading-none">ELEVATE</p>
            <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">Student Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 overflow-y-auto py-2">
        {/* {(!col || mobile) && (
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest px-3 mb-2">Navigation</p>
        )} */}
        <ul className="space-y-0.5">
          {NAV.map(({ to, label, Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={mobile ? onClose : undefined}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    col && !mobile ? 'justify-center px-2' : '',
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
                  ].join(' ')}
                  title={col && !mobile ? label : undefined}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{width:18,height:18}} />
                  {(!col || mobile) && (
                    <span className="flex-1 truncate">{label}</span>
                  )}
                  {active && (!col || mobile) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0"></span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-700/60 pt-3 pb-4 px-2 space-y-1">
        {(!col || mobile) && (
          <button
            onClick={mobile ? onClose : toggle}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" style={{width:16,height:16}} />
            <span>{mobile ? 'Close' : 'Collapse'}</span>
          </button>
        )}
        {col && !mobile && (
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
            title="Expand"
          >
            <ChevronRight style={{width:16,height:16}} />
          </button>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all ${col && !mobile ? 'justify-center px-2' : ''}`}
        >
          <LogOut style={{width:16,height:16}} className="flex-shrink-0" />
          {(!col || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
