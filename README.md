# Ogwu — Web Admin Dashboard

The hospital-facing admin dashboard for the Ogwu healthcare platform. Clinicians and hospital administrators use this to manage patients, respond to async consultation threads, view appointments, and configure their hospital profile.

Part of the broader Ogwu monorepo: [github.com/iheomach/ogwu](https://github.com/iheomach/ogwu)

---

## Screenshots

> Add screenshots here — see `SCREENSHOTS.md` in the main repo for the full shot list.

---

## Features

### Dashboard
- Today's appointment count, pending consult count, total patient count
- Upcoming appointments at a glance
- Recent consult thread activity

### Patients
- Full list of patients who have interacted with the hospital
- Search by name or phone
- Per-patient profile page: demographics, triage history, AI triage insights, appointment history

### Consults
- Three-column layout: patient list → thread list → conversation
- Search and filter patients by name/phone
- Per-patient thread list with sort (newest / oldest / by urgency) and filters (status, urgency tier)
- Full conversation view with provider reply input
- Closed threads rendered as read-only with an end-of-conversation notice
- Thread titles are GPT-generated 6-word condition summaries; duplicates get roman numeral suffixes (I, II, III…)

### Appointments
- Full appointment list scoped to the hospital
- Status management

### Settings
- Hospital profile editing: name, phone, city, state, country (dropdown: Nigeria / India / United States)
- Google Calendar integration status

---

## Tech stack

| | |
|---|---|
| Framework | React 18, TypeScript, Vite |
| Styling | Tailwind CSS with custom design tokens |
| Database | Supabase (direct client — RLS enforced) |
| Auth | Supabase Auth (email/password) |
| Icons | Lucide React |
| Routing | React Router v6 |

---

## Design tokens

Custom Tailwind tokens used throughout:

| Token | Usage |
|---|---|
| `purple` | Primary brand colour |
| `purple-light` | Tinted backgrounds, hover states |
| `grey-900 / 700 / 500 / 300` | Text hierarchy |
| `glass` | Frosted-glass card/input surface |
| `success / error` | Status indicators |

---

## Local setup

```bash
npm install
npm run dev
```

Required environment variables (`.env`):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

The dashboard connects directly to Supabase using the `anon` key. All data access is enforced by row-level security policies — each admin can only see data for their own hospital (matched via `admin_user_id` on the `hospitals_directory` table).

---

## Roadmap

- [ ] **Knowledge base / regulatory assistant** — hospital admins upload PDFs (formularies, care protocols, policies); a RAG pipeline over pgvector lets the agent and a chat interface answer hospital-specific questions
- [ ] **Push notification configuration** — per-hospital settings for patient notification triggers
- [ ] **Doctor management** — invite and manage doctors associated with the hospital
- [ ] **Analytics** — appointment completion rates, triage urgency distribution, consult response times

---

## License

MIT
