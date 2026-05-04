# Ogwu Hospital Portal — Landing Page Spec

## Overview

Public-facing marketing page at the root domain (e.g. `hospital.ogwu.app` or `ogwu.app/hospitals`).
Target audience: hospital administrators, clinic managers, department heads.
Goal: get them to request access / sign up.

---

## Color & Style

Inherit from the admin portal design system:
- Background: `#FAF7FB`
- Primary: `#450050` (deep purple)
- Accent light: `#F3EAF4`
- Text: `#1A1A2E` (headers), `#5A5A72` (body)
- Glass cards: `rgba(255,255,255,0.55)` with `backdrop-filter: blur(12px)`
- Font: Inter (same as portal)

The page should feel like a polished SaaS product site — not clinical/sterile.

---

## Page Sections

### 1. Navbar
- Logo: `Ogwu` wordmark (purple) + small pill badge `for Hospitals`
- Links: Features, How it works, Contact
- CTA button (top right): `Request access` (filled purple)
- Sticky on scroll, slight frosted glass background when scrolled

---

### 2. Hero

**Headline:**
> The command center for every patient Ogwu sends your way.

**Subheadline:**
> Ogwu triages patients before they reach you. The hospital portal gives your team real-time visibility into incoming consults, appointment requests, and patient health summaries — so you can respond faster and with full context.

**CTAs:**
- Primary: `Request access` (purple, large)
- Secondary: `See how it works` (ghost, scrolls to section 3)

**Visual:**
- Mockup of the dashboard (stat cards + appointments table) — can use a browser-frame screenshot of the actual portal
- Subtle animated glow/gradient behind the mockup in purple tones

---

### 3. Stats Bar (social proof strip)
Single row, light purple background band:

| Stat | Label |
|------|-------|
| < 3 min | Average triage time |
| 6 languages | Supported by Ogwu AI |
| Real-time | Consult & appointment sync |
| Zero setup | Calendar & Meet links included |

---

### 4. Features (3-column grid)

Each card: icon (lucide), bold title, 2-sentence description.

| Icon | Title | Body |
|------|-------|------|
| `ClipboardList` | Pre-triaged patients | Every patient arrives with an urgency rating, symptom summary, and AI-recommended specialty — before your team lifts a finger. |
| `MessageSquare` | Async consult threads | Patients can message your team directly through Ogwu. Respond on your schedule without phone tag. |
| `CalendarCheck` | Appointment management | Confirm, reschedule, or cancel appointments with one click. Google Meet links are generated automatically. |
| `Users` | Full patient profiles | View demographics, medical history, past triage intakes, and AI session summaries in one place. |
| `Globe` | Multilingual patients | Ogwu supports English, Igbo, Yoruba, Hausa, French, and Spanish — your portal reflects that context. |
| `Shield` | Secure by default | Built on Supabase with row-level security. Each hospital sees only its own data. |

---

### 5. How It Works

Step-by-step flow, horizontal on desktop / vertical on mobile. Numbered steps with a connecting line.

1. **Patient opens Ogwu** — describes their symptoms to the AI assistant in any supported language.
2. **Ogwu triages** — assigns urgency, extracts symptoms, recommends a specialty, and suggests a care pathway.
3. **Patient books or consults** — requests an appointment at your hospital or starts an async consult thread.
4. **Your team sees it instantly** — the hospital portal surfaces the request with full context: urgency, summary, patient history.
5. **You respond** — confirm the appointment, reply to the consult, or refer the patient. Done.

---

### 6. Testimonial / Quote Block (placeholder)

> "Ogwu means medicine in Igbo. We built it so that anyone, anywhere in Nigeria, can get the right care — fast."

— Richard, Founder

Single centered quote, light purple card background, subtle border.

---

### 7. CTA Section (bottom)

**Headline:**
> Ready to bring your hospital onto Ogwu?

**Subheadline:**
> Access is currently by invitation. Fill in your details and we'll be in touch.

**Form fields:**
- Hospital name (text)
- Your name (text)
- Role / title (text)
- Work email (email)
- Country (select)
- Submit: `Request access`

Form submits to a Supabase table `hospital_access_requests` or a simple email via a serverless function.

---

### 8. Footer

- Logo + one-line tagline: `AI-powered triage for modern healthcare.`
- Links: Privacy Policy, Terms of Service, Contact
- `© 2026 Ogwu Health`

---

## Routing

| Path | Page |
|------|------|
| `/` | Landing page (this spec) |
| `/login` | Hospital admin login |
| `/dashboard` | Portal (auth-gated) |

Currently `App.tsx` serves the portal directly. Refactor needed:
- If `session === null` and path is `/` → show landing page
- If `session === null` and path is `/login` → show `LoginPage`
- Add `<Route path="/" element={<LandingPage />} />` before the auth gate

---

## Implementation Notes

- Build as `src/pages/LandingPage.tsx`
- Sections as sub-components: `Hero`, `StatsBar`, `Features`, `HowItWorks`, `CTASection`, `Footer`
- `react-router-dom` `<Link>` for internal nav, smooth scroll for `#how-it-works` anchor
- Mobile responsive: single-column on `< md`, grid on `>= md`
- No external animation libraries — CSS transitions + Tailwind `animate-` utilities only
- The access request form does not require auth; it writes to Supabase as an unauthenticated insert (RLS policy: insert only, no select)
