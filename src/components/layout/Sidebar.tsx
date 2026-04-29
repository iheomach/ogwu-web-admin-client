import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/consults', label: 'Consults', icon: MessageSquare },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="w-60 shrink-0 bg-purple flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-7 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/80" />
          <span className="text-[13px] font-semibold tracking-[2px] uppercase text-white/90">
            Ogwu
          </span>
        </div>
        <p className="text-[11px] text-white/40 mt-1 tracking-wide">Hospital Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              ['nav-item', isActive ? 'nav-item-active' : ''].filter(Boolean).join(' ')
            }
          >
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={handleLogout} className="nav-item w-full">
          <LogOut size={17} strokeWidth={1.8} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
