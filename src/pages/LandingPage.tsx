import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  MessageSquare,
  CalendarCheck,
  Users,
  Globe,
  Shield,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Tokens ────────────────────────────────────────────────────────────────
const C = {
  bg: '#FAF7FB',
  primary: '#450050',
  accentLight: '#F3EAF4',
  heading: '#1A1A2E',
  body: '#5A5A72',
  glass: 'rgba(255,255,255,0.55)',
};

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(250,247,251,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(69,0,80,0.07)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/ogwu-logo-horizontal.png" alt="Ogwu" height={32} style={{ display: 'block' }} />
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
            style={{ background: C.accentLight, color: C.primary }}
          >
            for Hospitals
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it works', id: 'how-it-works' },
            { label: 'Contact', id: 'cta' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-medium transition-colors hover:opacity-100"
              style={{ color: C.body }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: C.body }}
          >
            Sign in
          </button>
          <button
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-semibold px-5 py-2 rounded-md transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: '#fff' }}
          >
            Request access
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(69,0,80,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-3xl mx-auto">
        <h1
          className="text-5xl md:text-[56px] font-bold leading-[1.08] tracking-[-1.5px] mb-5"
          style={{ color: C.heading }}
        >
          The command center for every patient Ogwu sends your way.
        </h1>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: C.body }}>
          Ogwu triages patients before they reach you. The hospital portal gives your team real-time
          visibility into incoming consults, appointment requests, and patient health summaries — so
          you can respond faster and with full context.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => scrollTo('cta')}
            className="text-sm font-semibold px-7 py-3 rounded-md shadow-md transition-opacity hover:opacity-90"
            style={{ background: C.primary, color: '#fff', boxShadow: '0 6px 20px rgba(69,0,80,0.28)' }}
          >
            Request access
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="text-sm font-semibold px-7 py-3 rounded-md border transition-colors hover:bg-purple-light"
            style={{ color: C.primary, borderColor: 'rgba(69,0,80,0.2)' }}
          >
            See how it works
          </button>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-16 relative">
          {/* Glow behind mockup */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 80%, rgba(69,0,80,0.14) 0%, transparent 70%)',
              filter: 'blur(24px)',
              transform: 'translateY(12px)',
            }}
          />
          {/* Browser frame */}
          <div
            className="relative rounded-2xl overflow-hidden border text-left"
            style={{
              border: '1px solid rgba(69,0,80,0.12)',
              boxShadow: '0 24px 60px rgba(69,0,80,0.14)',
              background: C.glass,
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Browser chrome */}
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(69,0,80,0.08)', background: 'rgba(255,255,255,0.8)' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
              </div>
              <div className="flex-1 mx-3 h-6 rounded text-[11px] flex items-center px-3" style={{ background: 'rgba(69,0,80,0.05)', color: C.body }}>
                hospital.ogwu.app/dashboard
              </div>
            </div>

            {/* Dashboard content preview */}
            <div className="flex" style={{ minHeight: '240px' }}>
              {/* Sidebar */}
              <div className="w-48 shrink-0 p-4 flex flex-col gap-1" style={{ background: C.primary }}>
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <span className="text-[11px] font-bold tracking-[2px] uppercase text-white/80">Ogwu</span>
                </div>
                {['Dashboard', 'Appointments', 'Consults', 'Patients'].map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-3 py-2 rounded text-[11px] font-medium"
                    style={{ background: i === 0 ? 'rgba(255,255,255,0.15)' : 'transparent', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)' }}
                  >
                    <div className="w-3 h-3 rounded-sm opacity-60" style={{ background: 'currentColor' }} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div className="flex-1 p-5" style={{ background: C.bg }}>
                <p className="text-[11px] font-bold tracking-wide uppercase mb-3" style={{ color: C.body }}>Dashboard</p>
                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {["Today's appointments", 'Open consults', 'Upcoming (7d)'].map((label, i) => (
                    <div key={label} className="rounded-lg p-3" style={{ background: '#fff', border: '1px solid rgba(69,0,80,0.07)' }}>
                      <p className="text-[9px] uppercase tracking-wide mb-1" style={{ color: C.body }}>{label}</p>
                      <p className="text-xl font-bold" style={{ color: C.heading }}>{['4', '12', '31'][i]}</p>
                    </div>
                  ))}
                </div>
                {/* Table rows */}
                <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(69,0,80,0.07)' }}>
                  {['Adaeze Obi', 'Emeka Nwosu', 'Fatima Bello'].map((name) => (
                    <div key={name} className="flex items-center justify-between px-3 py-2 border-b last:border-0 text-[10px]" style={{ borderColor: 'rgba(69,0,80,0.05)', color: C.body }}>
                      <span className="font-medium" style={{ color: C.heading }}>{name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px]" style={{ background: C.accentLight, color: C.primary }}>confirmed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────
const STATS = [
  { value: '< 3 min', label: 'Average triage time' },
  { value: '6 languages', label: 'Supported by Ogwu AI' },
  { value: 'Real-time', label: 'Consult & appointment sync' },
  { value: 'Zero setup', label: 'Calendar & Meet links included' },
];

function StatsBar() {
  return (
    <section style={{ background: C.accentLight }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold tracking-tight mb-1" style={{ color: C.primary }}>{value}</p>
            <p className="text-sm" style={{ color: C.body }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Pre-triaged patients',
    body: 'Every patient arrives with an urgency rating, symptom summary, and AI-recommended specialty — before your team lifts a finger.',
  },
  {
    icon: MessageSquare,
    title: 'Async consult threads',
    body: 'Patients can message your team directly through Ogwu. Respond on your schedule without phone tag.',
  },
  {
    icon: CalendarCheck,
    title: 'Appointment management',
    body: 'Confirm, reschedule, or cancel appointments with one click. Google Meet links are generated automatically.',
  },
  {
    icon: Users,
    title: 'Full patient profiles',
    body: 'View demographics, medical history, past triage intakes, and AI session summaries in one place.',
  },
  {
    icon: Globe,
    title: 'Multilingual patients',
    body: 'Ogwu supports English, Igbo, Yoruba, Hausa, French, and Spanish — your portal reflects that context.',
  },
  {
    icon: Shield,
    title: 'Secure by default',
    body: 'Built on Supabase with row-level security. Each hospital sees only its own data.',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: C.primary }}>Features</p>
          <h2 className="text-4xl font-bold tracking-[-1px]" style={{ color: C.heading }}>
            Everything your team needs, nothing they don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="p-6 rounded-2xl transition-shadow hover:shadow-md"
              style={{
                background: C.glass,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(69,0,80,0.08)',
                boxShadow: '0 4px 14px rgba(69,0,80,0.05)',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: C.accentLight }}
              >
                <Icon size={18} strokeWidth={1.8} style={{ color: C.primary }} />
              </div>
              <p className="text-sm font-bold mb-2" style={{ color: C.heading }}>{title}</p>
              <p className="text-sm leading-relaxed" style={{ color: C.body }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, title: 'Patient opens Ogwu', desc: 'Describes their symptoms to the AI assistant in any supported language.' },
  { n: 2, title: 'Ogwu triages', desc: 'Assigns urgency, extracts symptoms, recommends a specialty, and suggests a care pathway.' },
  { n: 3, title: 'Patient books or consults', desc: 'Requests an appointment at your hospital or starts an async consult thread.' },
  { n: 4, title: 'Your team sees it instantly', desc: 'The hospital portal surfaces the request with full context: urgency, summary, patient history.' },
  { n: 5, title: 'You respond', desc: 'Confirm the appointment, reply to the consult, or refer the patient. Done.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6" style={{ background: C.accentLight }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: C.primary }}>How it works</p>
          <h2 className="text-4xl font-bold tracking-[-1px]" style={{ color: C.heading }}>
            From symptom to care in five steps.
          </h2>
        </div>

        {/* Desktop: horizontal with connecting line */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div
            className="absolute top-5 left-0 right-0 h-px"
            style={{ background: 'rgba(69,0,80,0.15)', zIndex: 0 }}
          />
          <div className="relative grid grid-cols-5 gap-4" style={{ zIndex: 1 }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-4 shrink-0"
                  style={{ background: C.primary, color: '#fff' }}
                >
                  {n}
                </div>
                <p className="text-sm font-bold mb-1.5" style={{ color: C.heading }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: C.body }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden flex flex-col gap-6">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="flex gap-4 items-start">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: C.primary, color: '#fff' }}
              >
                {n}
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: C.heading }}>{title}</p>
                <p className="text-sm leading-relaxed" style={{ color: C.body }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial ──────────────────────────────────────────────────────────
function Testimonial() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="p-10 rounded-2xl"
          style={{
            background: C.accentLight,
            border: '1px solid rgba(69,0,80,0.10)',
          }}
        >
          <p className="text-xl font-medium leading-relaxed mb-6" style={{ color: C.heading }}>
            "Ogwu means medicine in Igbo. We built it so that anyone, anywhere in Nigeria, can get the right care — fast."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: C.primary }}>R</div>
            <p className="text-sm font-semibold" style={{ color: C.heading }}>Richard, Founder</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA / Access Request Form ────────────────────────────────────────────
const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Tanzania',
  'Uganda', 'Rwanda', 'Senegal', 'Côte d\'Ivoire', 'Other',
];

function CTASection() {
  const [form, setForm] = useState({
    hospital_name: '',
    contact_name: '',
    role: '',
    email: '',
    country: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const { error } = await supabase.from('hospital_access_requests').insert(form);
    if (error) {
      setErrorMsg(error.message);
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(69,0,80,0.14)',
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(8px)',
    fontSize: '14px',
    color: C.heading,
    outline: 'none',
  };

  return (
    <section id="cta" className="py-24 px-6" style={{ background: C.accentLight }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: C.primary }}>Get started</p>
          <h2 className="text-4xl font-bold tracking-[-1px] mb-3" style={{ color: C.heading }}>
            Ready to bring your hospital onto Ogwu?
          </h2>
          <p style={{ color: C.body }}>
            Access is currently by invitation. Fill in your details and we'll be in touch.
          </p>
        </div>

        {status === 'success' ? (
          <div
            className="text-center p-10 rounded-2xl"
            style={{ background: C.glass, backdropFilter: 'blur(12px)', border: '1px solid rgba(69,0,80,0.1)' }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.primary }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="text-lg font-bold mb-1" style={{ color: C.heading }}>Request received!</p>
            <p className="text-sm" style={{ color: C.body }}>We'll review your details and reach out shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 flex flex-col gap-4"
            style={{
              background: C.glass,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(69,0,80,0.09)',
              boxShadow: '0 8px 28px rgba(69,0,80,0.07)',
            }}
          >
            {[
              { key: 'hospital_name', label: 'Hospital name', placeholder: 'Lagos University Teaching Hospital' },
              { key: 'contact_name', label: 'Your name', placeholder: 'Dr. Adaeze Okonkwo' },
              { key: 'role', label: 'Role / title', placeholder: 'Chief Medical Officer' },
              { key: 'email', label: 'Work email', placeholder: 'you@hospital.com', type: 'email' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.heading }}>{label}</label>
                <input
                  style={inputStyle}
                  type={type ?? 'text'}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={set(key as keyof typeof form)}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: C.heading }}>Country</label>
              <select
                style={inputStyle}
                value={form.country}
                onChange={set('country')}
                required
              >
                <option value="" disabled>Select a country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 py-3 rounded-md text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: C.primary, color: '#fff' }}
            >
              {status === 'loading' ? 'Submitting…' : 'Request access'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 px-6 border-t" style={{ borderColor: 'rgba(69,0,80,0.07)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2.5">
            <img src="/ogwu-logo-mark.png" alt="Ogwu" width={28} height={28} style={{ display: 'block' }} />
          </div>
          <p className="text-xs mt-1" style={{ color: C.body }}>AI-powered triage for modern healthcare.</p>
        </div>

        <div className="flex items-center gap-6 text-xs" style={{ color: C.body }}>
          <Link to="#" className="hover:underline">Privacy Policy</Link>
          <Link to="#" className="hover:underline">Terms of Service</Link>
          <Link to="#" className="hover:underline">Contact</Link>
        </div>

        <p className="text-xs" style={{ color: C.body }}>© {new Date().getFullYear()} Ogwu Health</p>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export function LandingPage() {
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef} style={{ background: C.bg }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  );
}
