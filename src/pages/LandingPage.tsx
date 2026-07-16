import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Globe2,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  Shield,
  Stethoscope,
} from 'lucide-react';
import { supabase } from '../lib/supabase';


interface TriagePatient {
  name: string;
  age: number;
  concern: string;
  urgency: string;
  time: string;
  color: 'urgent' | 'review' | 'routine';
  language: string;
  specialty: string;
  summary: string;
  action: string;
}

const NAV_LINKS = [
  { label: 'Platform', id: 'platform' },
  { label: 'Workflow', id: 'workflow' },
  { label: 'Security', id: 'security' },
  { label: 'Access', id: 'cta' },
] as const;

const TRIAGE_QUEUE: TriagePatient[] = [
  {
    name: 'Adaeze Obi',
    age: 42,
    concern: 'Chest tightness and shortness of breath after climbing stairs',
    urgency: 'High',
    time: '2 min ago',
    color: 'urgent',
    language: 'Igbo',
    specialty: 'Cardiology',
    summary: 'Igbo-speaking patient reports chest tightness, breathlessness, and mild dizziness. Ogwu flags red-flag symptoms and prepares a cardiology handoff for urgent nurse review.',
    action: 'Escalate for same-day review and confirm vitals before appointment booking.',
  },
  {
    name: 'Musa Bello',
    age: 31,
    concern: 'Fever, headache, and body aches after travel to Kano',
    urgency: 'Review',
    time: '8 min ago',
    color: 'review',
    language: 'Hausa',
    specialty: 'General medicine',
    summary: 'Hausa-speaking patient describes fever, headache, fatigue, and recent travel. Ogwu captures travel context and recommends clinician review for infection screening.',
    action: 'Send fever protocol, ask about malaria testing, and offer next available GP slot.',
  },
  {
    name: 'Temitope Adeyemi',
    age: 36,
    concern: 'Child with wheezing at night and missed inhaler refill',
    urgency: 'Routine',
    time: '14 min ago',
    color: 'routine',
    language: 'Yoruba',
    specialty: 'Pediatrics',
    summary: 'Yoruba-speaking parent asks about nighttime wheezing and an inhaler refill for their child. Ogwu captures age, medication context, and warning signs for pediatric review.',
    action: 'Send pediatric breathing checklist and offer the next family medicine slot.',
  },
];

const STATS = [
  { value: '< 3 min', label: 'Typical guided intake' },
  { value: '6', label: 'Patient languages supported' },
  { value: '24/7', label: 'AI intake before front desk review' },
  { value: '1 view', label: 'Consults, bookings, and summaries' },
] as const;

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Pre-triaged patient handoff',
    body: 'Every request arrives with symptoms, urgency, history prompts, and recommended next action so staff can prioritize quickly.',
  },
  {
    icon: MessageSquare,
    title: 'Async consult workspace',
    body: 'Keep patient messages, clinical context, and internal decisions in one clean thread instead of scattered calls and texts.',
  },
  {
    icon: CalendarCheck,
    title: 'Appointment command center',
    body: 'Review requests, confirm visits, reschedule slots, and attach Google Meet links without moving between tools.',
  },
  {
    icon: Globe2,
    title: 'Built for multilingual care',
    body: 'Ogwu captures context from English, Igbo, Yoruba, Hausa, French, and Spanish, then presents it clearly to your team.',
  },
  {
    icon: LayoutDashboard,
    title: 'Hospital-grade visibility',
    body: 'Leadership can see consult volume, patient flow, response bottlenecks, and operational health from one dashboard.',
  },
  {
    icon: Shield,
    title: 'Protected access model',
    body: 'The portal is designed around hospital-scoped access, row-level data boundaries, and least-privilege staff workflows.',
  },
] as const;

const TRUST_ITEMS = [
  { icon: LockKeyhole, title: 'Hospital-scoped access', body: 'Each hospital only sees its own patients, consults, appointments, and staff records.' },
  { icon: Shield, title: 'Role-aware workspace', body: 'Designed for admins, clinicians, and coordinators to operate with the right level of access.' },
  { icon: Activity, title: 'Operational audit trail', body: 'Critical actions can be reviewed across patient flow, consult handling, and appointment updates.' },
] as const;

const PRODUCT_CARDS = [
  {
    title: 'Patient AI intake',
    eyebrow: 'Mobile assistant',
    visual: 'intake',
    src: '/landing-assets/ogwu-ai-intake-platform.png',
    description: 'A conversational intake that turns patient language into structured clinical context.',
    detail: 'The B2C Ogwu app guides patients through symptoms, timing, severity, medications, and care preferences. It supports multilingual intake, tool status messages, and triage completion so hospital teams receive something cleaner than a raw chat transcript.',
    bullets: ['Guided symptom capture', 'Multilingual context', 'Urgency and specialty suggestions'],
  },
  {
    title: 'Hospital handoff queue',
    eyebrow: 'Provider workspace',
    visual: 'queue',
    src: '/landing-assets/ogwu-hospital-operations.png',
    description: 'A hospital-facing queue for consults, appointment requests, patient summaries, and response status.',
    detail: 'The admin portal turns incoming patient requests into actionable rows with urgency, summary, language, suggested specialty, and next action. Staff can see who needs review, who can be booked, and which consults need follow-up without digging through messages.',
    bullets: ['Triage queue', 'Patient summary cards', 'Role-scoped hospital access'],
  },
  {
    title: 'Care coordination',
    eyebrow: 'Appointments and consults',
    visual: 'care',
    src: '/landing-assets/ogwu-mobile-care-flow.png',
    description: 'Appointment booking, async consult threads, hospital search, and calendar handoff in one flow.',
    detail: 'Ogwu connects the patient app to hospitals: send health summaries, search hospitals, create consult threads, book appointments, and add confirmed visits to Google or Apple Calendar with meeting links attached.',
    bullets: ['Hospital search and routing', 'Async provider replies', 'Google and Apple Calendar handoff'],
  },
] as const;

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Tanzania',
  'Uganda', 'Rwanda', 'Senegal', "Côte d'Ivoire", 'Other',
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function ProductVisual({ type, src, title }: { type: string; src: string; title: string }) {
  return (
    <div className={`lp-product-visual lp-product-visual--${type}`}>
      <img src={src} alt={`${title} Ogwu product preview`} className="lp-product-shot" />
      <div className="lp-phone-frame">
        <div className="lp-phone-speaker" />
        <div className="lp-phone-card lp-phone-card--primary">How long have you had these symptoms?</div>
        <div className="lp-phone-card">Fever started yesterday evening.</div>
        <div className="lp-phone-card lp-phone-card--mint">Ogwu is checking red flags...</div>
      </div>
      <div className="lp-product-panel">
        <span>{type === 'queue' ? 'Hospital queue' : type === 'care' ? 'Care plan' : 'AI intake'}</span>
        <strong>{type === 'queue' ? '12 open consults' : type === 'care' ? 'Appointment confirmed' : 'Urgency: review today'}</strong>
        <div className="lp-visual-lines"><i /><i /><i /></div>
      </div>
    </div>
  );
}

function ExpandableProductCard({ card }: { card: typeof PRODUCT_CARDS[number] }) {
  const [active, setActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setActive(false);
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) setActive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [active]);

  return (
    <>
      {active && <div className="lp-expandable-overlay" />}
      {active && (
        <div className="lp-expandable-stage">
          <article ref={cardRef} className="lp-expandable-modal">
            <ProductVisual type={card.visual} src={card.src} title={card.title} />
            <div className="lp-expandable-body">
              <button className="lp-expandable-close" onClick={() => setActive(false)} aria-label="Close card">+</button>
              <p className="lp-eyebrow">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.detail}</p>
              <ul>
                {card.bullets.map((item) => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}
              </ul>
            </div>
          </article>
        </div>
      )}
      <article className="lp-expandable-card" onClick={() => setActive(true)}>
        <ProductVisual type={card.visual} src={card.src} title={card.title} />
        <div className="lp-expandable-card-copy">
          <p>{card.description}</p>
          <h3>{card.title}</h3>
        </div>
        <button aria-label={`Open ${card.title}`}>+</button>
      </article>
    </>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lp-navbar ${scrolled ? 'lp-navbar--scrolled' : ''}`}>
      <div className="lp-nav-inner">
        <button className="lp-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/ogwu-logo-horizontal.png" alt="Ogwu" className="lp-nav-logo" />
          <span className="lp-for-hospitals-badge">Hospital OS</span>
        </button>

        <nav className="lp-nav-links">
          {NAV_LINKS.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} className="lp-nav-link">
              {label}
            </button>
          ))}
        </nav>

        <div className="lp-nav-actions">
          <button onClick={() => navigate('/login')} className="lp-nav-signin">Sign in</button>
          <button onClick={() => scrollTo('cta')} className="lp-nav-cta">Request access</button>
        </div>
      </div>
    </header>
  );
}

function TriageConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TRIAGE_QUEUE[activeIndex];
  const signals = [
    { label: 'Symptoms parsed', value: active.color === 'urgent' ? '18' : active.color === 'review' ? '12' : '7', icon: Activity },
    { label: 'Suggested specialty', value: active.specialty, icon: Stethoscope },
    { label: 'Language', value: active.language, icon: Languages },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % TRIAGE_QUEUE.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="lp-console-shell">
      <div className="lp-console-topbar">
        <div className="lp-window-dots"><span /><span /><span /></div>
        <div className="lp-console-url">hospital.ogwu.app/live-intake</div>
        <div className="lp-live-pill"><span /> Live triage</div>
      </div>

      <div className="lp-console-grid">
        <aside className="lp-console-sidebar">
          <div className="lp-console-logo-row">
            <span className="lp-mini-mark">O</span>
            <span>Ogwu</span>
          </div>
          {['Dashboard', 'Intake queue', 'Consults', 'Appointments'].map((item, index) => (
            <button key={item} className={`lp-console-nav ${index === 1 ? 'lp-console-nav--active' : ''}`}>
              <span />{item}
            </button>
          ))}
        </aside>

        <main className="lp-console-main">
          <div className="lp-console-header">
            <div>
              <p className="lp-console-kicker">Care queue</p>
              <h3>Incoming patients</h3>
            </div>
          </div>

          <div className="lp-patient-list">
            {TRIAGE_QUEUE.map((patient, index) => (
              <button
                key={patient.name}
                onClick={() => setActiveIndex(index)}
                className={`lp-patient-row ${activeIndex === index ? 'lp-patient-row--active' : ''}`}
              >
                <div>
                  <div className="lp-patient-name">{patient.name}, {patient.age}</div>
                  <div className="lp-patient-concern">{patient.concern}</div>
                </div>
                <span className={`lp-urgency lp-urgency--${patient.color}`}>{patient.urgency}</span>
              </button>
            ))}
          </div>
        </main>

        <aside className="lp-console-insight">
          <p className="lp-console-kicker">AI summary</p>
          <h4>{active.name}</h4>
          <p>{active.summary}</p>
          <div className="lp-signal-grid">
            {signals.map(({ label, value, icon: Icon }) => (
              <div key={label} className="lp-signal-card">
                <Icon size={15} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="lp-next-action">
            <Clock3 size={16} /> {active.action}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="lp-hero">
      <div className="lp-orb lp-orb-a" />
      <div className="lp-orb lp-orb-b" />
      <div className="lp-hero-inner">
        <div className="lp-hero-copy">
          <h1>Turn every patient message into a clear next step.</h1>
          <p>
            Ogwu gives hospitals a polished operating layer for AI triage, consults, appointments, and patient context, so teams can move from symptom to care without losing the thread.
          </p>
          <div className="lp-hero-actions">
            <button onClick={() => scrollTo('cta')} className="lp-btn-primary">Request access <ArrowRight size={16} /></button>
            <button onClick={() => scrollTo('platform')} className="lp-btn-outline">Explore the platform</button>
          </div>
          <div className="lp-hero-proof">
            {['Clinical intake', 'Hospital queue', 'Patient follow-up'].map((item) => (
              <span key={item}><CheckCircle2 size={15} /> {item}</span>
            ))}
          </div>
        </div>
        <div className="lp-hero-visual">
          <TriageConsole />
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="lp-stats-bar">
      <div className="lp-stats-inner">
        {STATS.map(({ value, label }) => (
          <div key={label} className="lp-stat-card">
            <p className="lp-stat-value">{value}</p>
            <p className="lp-stat-label">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="lp-section-intro">
      <p className="lp-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  );
}

function Features() {
  return (
    <section id="platform" className="lp-section lp-platform-section">
      <div className="lp-container">
        <SectionIntro
          eyebrow="Platform"
          title="A patient flow layer that feels like a product, not a spreadsheet."
          body="Ogwu packages the messy front door of healthcare into a calm, high-signal workspace for hospital teams."
        />
        <div className="lp-feature-grid">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="lp-feature-card">
              <div className="lp-feature-icon-box"><Icon size={19} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section id="workflow" className="lp-section lp-workflow-section">
      <div className="lp-container lp-workflow-layout">
        <div className="lp-workflow-copy">
          <p className="lp-eyebrow">Workflow</p>
          <h2 className="lp-section-title">Designed around the real path from concern to care.</h2>
          <p className="lp-section-body">
            Patients do not arrive as clean rows in a database. Ogwu turns unstructured symptoms into a guided queue your team can actually operate.
          </p>
        </div>

        <div className="lp-product-card-grid" aria-label="Ogwu product offerings">
          {PRODUCT_CARDS.map((card) => <ExpandableProductCard key={card.title} card={card} />)}
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section id="security" className="lp-section lp-security-section">
      <div className="lp-container lp-security-card">
        <div>
          <p className="lp-eyebrow">Security and operations</p>
          <h2 className="lp-section-title">Built for hospitals that need clarity, boundaries, and speed.</h2>
          <p className="lp-section-body">
            The portal keeps sensitive workflows organized around hospital ownership, staff roles, and operational accountability.
          </p>
        </div>
        <div className="lp-trust-grid">
          {TRUST_ITEMS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="lp-trust-item">
              <Icon size={18} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FounderNote() {
  return (
    <section className="lp-founder-section">
      <div className="lp-founder-card">
        <div className="lp-founder-mark">Ọ</div>
        <p>
          “Ogwu means medicine in Igbo. The vision is simple: make the first step toward care feel intelligent, human, and accessible before a patient ever reaches the front desk.”
        </p>
        <div>
          <strong>Iheoma Omorotionmwan</strong>
          <span>Founder, Ogwu Health</span>
        </div>
      </div>
    </section>
  );
}

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
    <section id="cta" className="lp-cta-section">
      <div className="lp-container lp-cta-layout">
        <div className="lp-cta-copy">
          <p className="lp-eyebrow">Private access</p>
          <h2>Bring Ogwu into your hospital workflow.</h2>
          <p>
            Tell us about your hospital and the patient flow you want to improve. We will reach out with access details and onboarding next steps.
          </p>
          <div className="lp-cta-list">
            <span><CheckCircle2 size={16} /> Hospital workspace setup</span>
            <span><CheckCircle2 size={16} /> Intake and appointment flow review</span>
            <span><CheckCircle2 size={16} /> Staff access planning</span>
          </div>
        </div>

        {status === 'success' ? (
          <div className="lp-success-card">
            <div className="lp-success-icon"><CheckCircle2 size={22} /></div>
            <h3>Request received</h3>
            <p>We will review your details and reach out shortly.</p>
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
              <select className="lp-form-input" value={form.country} onChange={set('country')} required>
                <option value="" disabled>Select a country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {status === 'error' && <p className="lp-form-error">{errorMsg}</p>}

            <button type="submit" disabled={status === 'loading'} className="lp-form-submit">
              {status === 'loading' ? 'Submitting…' : 'Request access'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <img src="/ogwu-logo-horizontal.png" alt="Ogwu" className="lp-footer-logo" />
          <p>AI-powered intake and hospital operations for modern care teams.</p>
        </div>
        <div className="lp-footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <a href="mailto:iheoma@ogwu.app">Contact</a>
        </div>
        <p>© {new Date().getFullYear()} Ogwu Health</p>
      </div>
    </footer>
  );
}

export function LandingPage() {
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={topRef} className="lp-root">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <Workflow />
      <Security />
      <FounderNote />
      <CTASection />
      <Footer />
    </div>
  );
}
