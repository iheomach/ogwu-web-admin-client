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
    <header className={`lp-navbar ${scrolled ? 'lp-navbar--scrolled' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/ogwu-logo-horizontal.png" alt="Ogwu" className="lp-nav-logo" />
          <span className="lp-for-hospitals-badge">for Hospitals</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Features', id: 'features' },
            { label: 'How it works', id: 'how-it-works' },
            { label: 'Contact', id: 'cta' },
          ].map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} className="lp-nav-link">
              {label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="lp-nav-signin">
            Sign in
          </button>
          <button
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            className="lp-nav-cta"
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
      <div className="lp-hero-glow" />

      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-[56px] font-bold leading-[1.08] tracking-[-1.5px] mb-5 lp-text-heading">
          The command center for every patient Ogwu sends your way.
        </h1>
        <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-10 lp-text-body">
          Ogwu triages patients before they reach you. The hospital portal gives your team real-time
          visibility into incoming consults, appointment requests, and patient health summaries — so
          you can respond faster and with full context.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => scrollTo('cta')} className="lp-btn-primary">
            Request access
          </button>
          <button onClick={() => scrollTo('how-it-works')} className="lp-btn-outline">
            See how it works
          </button>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-16 relative">
          <div className="lp-mockup-glow" />
          <div className="lp-browser-frame">
            {/* Browser chrome */}
            <div className="lp-browser-chrome">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
              </div>
              <div className="lp-browser-addressbar">
                hospital.ogwu.app/dashboard
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="flex" style={{ minHeight: '240px' }}>
              {/* Sidebar */}
              <div className="lp-mock-sidebar">
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <span className="text-[11px] font-bold tracking-[2px] uppercase text-white/80">Ogwu</span>
                </div>
                {['Dashboard', 'Appointments', 'Consults', 'Patients'].map((item, i) => (
                  <div
                    key={item}
                    className={`lp-mock-nav-item ${i === 0 ? 'lp-mock-nav-item--active' : 'lp-mock-nav-item--inactive'}`}
                  >
                    <div className="w-3 h-3 rounded-sm opacity-60 bg-current" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="lp-mock-main">
                <p className="text-[11px] font-bold tracking-wide uppercase mb-3 lp-text-body">Dashboard</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {["Today's appointments", 'Open consults', 'Upcoming (7d)'].map((label, i) => (
                    <div key={label} className="lp-mock-stat-card">
                      <p className="text-[9px] uppercase tracking-wide mb-1 lp-text-body">{label}</p>
                      <p className="text-xl font-bold lp-text-heading">{['4', '12', '31'][i]}</p>
                    </div>
                  ))}
                </div>
                <div className="lp-mock-table">
                  {['Adaeze Obi', 'Emeka Nwosu', 'Fatima Bello'].map((name) => (
                    <div key={name} className="lp-mock-table-row">
                      <span className="font-medium lp-text-heading">{name}</span>
                      <span className="lp-mock-badge">confirmed</span>
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
    <section className="lp-stats-bar">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="lp-stat-value">{value}</p>
            <p className="lp-stat-label">{label}</p>
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
          <p className="lp-eyebrow">Features</p>
          <h2 className="lp-section-heading">Everything your team needs, nothing they don't.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="lp-feature-card">
              <div className="lp-feature-icon-box">
                <Icon size={18} strokeWidth={1.8} className="text-purple" />
              </div>
              <p className="text-sm font-bold mb-2 lp-text-heading">{title}</p>
              <p className="text-sm leading-relaxed lp-text-body">{body}</p>
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
    <section id="how-it-works" className="lp-hiw-section py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="lp-eyebrow">How it works</p>
          <h2 className="lp-section-heading">From symptom to care in five steps.</h2>
        </div>

        {/* Desktop: horizontal with connecting line */}
        <div className="hidden md:block relative">
          <div className="lp-step-connector" />
          <div className="relative grid grid-cols-5 gap-4" style={{ zIndex: 1 }}>
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div className="lp-step-number">{n}</div>
                <p className="text-sm font-bold mb-1.5 lp-text-heading">{title}</p>
                <p className="text-xs leading-relaxed lp-text-body">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden flex flex-col gap-6">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="flex gap-4 items-start">
              <div className="lp-step-number--sm">{n}</div>
              <div>
                <p className="text-sm font-bold mb-1 lp-text-heading">{title}</p>
                <p className="text-sm leading-relaxed lp-text-body">{desc}</p>
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
        <div className="lp-quote-card">
          <p className="text-xl font-medium leading-relaxed mb-6 lp-text-heading">
            "Ogwu means medicine in Igbo. We built it so that anyone, anywhere in Nigeria, can get the right care — fast."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="lp-avatar-initial">R</div>
            <p className="text-sm font-semibold lp-text-heading">Richard, Founder</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA / Access Request Form ────────────────────────────────────────────
const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Tanzania',
  'Uganda', 'Rwanda', 'Senegal', "Côte d'Ivoire", 'Other',
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

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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

  return (
    <section id="cta" className="lp-cta-section py-24 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="lp-eyebrow">Get started</p>
          <h2 className="lp-section-heading mb-3">Ready to bring your hospital onto Ogwu?</h2>
          <p className="lp-text-body">
            Access is currently by invitation. Fill in your details and we'll be in touch.
          </p>
        </div>

        {status === 'success' ? (
          <div className="lp-success-card">
            <div className="lp-success-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4.5 4.5L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-lg font-bold mb-1 lp-text-heading">Request received!</p>
            <p className="text-sm lp-text-body">We'll review your details and reach out shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="lp-form-card">
            {[
              { key: 'hospital_name', label: 'Hospital name', placeholder: 'Lagos University Teaching Hospital' },
              { key: 'contact_name', label: 'Your name', placeholder: 'Dr. Adaeze Okonkwo' },
              { key: 'role', label: 'Role / title', placeholder: 'Chief Medical Officer' },
              { key: 'email', label: 'Work email', placeholder: 'you@hospital.com', type: 'email' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="lp-form-label">{label}</label>
                <input
                  className="lp-form-input"
                  type={type ?? 'text'}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={set(key as keyof typeof form)}
                  required
                />
              </div>
            ))}

            <div>
              <label className="lp-form-label">Country</label>
              <select
                className="lp-form-input"
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

            <button type="submit" disabled={status === 'loading'} className="lp-form-submit">
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
    <footer className="lp-footer">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <img src="/ogwu-logo-mark.png" alt="Ogwu" className="lp-footer-mark" />
          <p className="text-xs mt-1 lp-text-body">AI-powered triage for modern healthcare.</p>
        </div>

        <div className="flex items-center gap-6 text-xs lp-text-body">
          <Link to="#" className="hover:underline">Privacy Policy</Link>
          <Link to="#" className="hover:underline">Terms of Service</Link>
          <Link to="#" className="hover:underline">Contact</Link>
        </div>

        <p className="text-xs lp-text-body">© {new Date().getFullYear()} Ogwu Health</p>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export function LandingPage() {
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef} className="lp-root">
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
