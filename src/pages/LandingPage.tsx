import { useNavigate } from 'react-router-dom';
import { CalendarDays, MessageSquare, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Appointment management',
    desc: 'View, schedule, and track all patient appointments in one place.',
  },
  {
    icon: MessageSquare,
    title: 'Async consults',
    desc: 'Handle asynchronous consultation threads with patients seamlessly.',
  },
  {
    icon: Users,
    title: 'Patient records',
    desc: 'Access and manage patient profiles, history, and contact details.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* Top nav */}
      <header className="w-full border-b border-purple/[0.08] bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple" />
            <span className="text-[13px] font-semibold tracking-[2px] uppercase text-purple">
              Ogwu
            </span>
          </div>
          <Button size="md" onClick={() => navigate('/login')}>
            Sign in
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center gap-2 bg-purple-light border border-purple/10 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-purple" />
          <span className="text-[11px] font-semibold tracking-[1.5px] uppercase text-purple">
            Hospital admin portal
          </span>
        </div>

        <h1 className="text-5xl font-bold text-grey-900 tracking-[-1.5px] leading-[1.1] max-w-xl mb-5">
          Healthcare admin,<br />simplified.
        </h1>

        <p className="text-base text-grey-500 max-w-md leading-relaxed mb-10">
          Manage appointments, consults, and patient records — all in one clean dashboard built for hospital staff.
        </p>

        <Button size="lg" onClick={() => navigate('/login')}>
          Get started
        </Button>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl w-full mt-20">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-left">
              <div className="w-10 h-10 rounded-md bg-purple-light flex items-center justify-center mb-4">
                <Icon size={18} className="text-purple" strokeWidth={1.8} />
              </div>
              <p className="text-sm font-semibold text-grey-900 mb-1">{title}</p>
              <p className="text-xs text-grey-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-grey-300 border-t border-purple/[0.06]">
        © {new Date().getFullYear()} Ogwu. All rights reserved.
      </footer>
    </div>
  );
}
