import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, User, Activity, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { UrgencyBadge, StatusBadge } from '../components/ui/Badge';

type PatientProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  biological_sex: string | null;
  dob: string | null;
  triage_intakes?: Array<{
    id: string;
    urgency: string;
    summary: string | null;
    answers: Array<{ q: string; a: string }> | null;
    updated_at: string;
    created_at: string;
  }>;
};

type AppointmentRow = {
  id: string;
  starts_at: string;
  duration_minutes: number;
  status: string;
  meeting_url: string | null;
  reason: string | null;
};

function computeAge(dob: string | null): string {
  if (!dob) return '—';
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  if (
    today.getMonth() < d.getMonth() ||
    (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())
  ) age--;
  return `${age} yrs`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-purple/[0.06] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-[0.8px] text-grey-500">{label}</span>
      <span className="text-sm font-medium text-grey-900">{value}</span>
    </div>
  );
}

export function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      const [{ data: profileData }, { data: apptData }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, phone, biological_sex, dob, triage_intakes(id, urgency, summary, answers, updated_at, created_at)')
          .eq('id', id)
          .maybeSingle(),
        supabase
          .from('appointments')
          .select('id, starts_at, duration_minutes, status, meeting_url, reason')
          .eq('patient_id', id)
          .order('starts_at', { ascending: false }),
      ]);
      if (mounted) {
        setPatient(profileData ?? null);
        setAppointments(apptData ?? []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const initials = patient
    ? [patient.first_name, patient.last_name].map(n => n?.trim()[0]?.toUpperCase() ?? '').join('')
    : '?';

  const latestIntake = patient?.triage_intakes?.[0] ?? null;

  return (
    <AppShell>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-grey-500 hover:text-grey-900 transition-colors mb-6"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Back
      </button>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-purple border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !patient ? (
        <div className="text-center py-20">
          <p className="text-sm font-medium text-grey-900">Patient not found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">

          {/* Left column */}
          <div className="col-span-1 flex flex-col gap-5">

            {/* Identity card */}
            <Card>
              <div className="flex flex-col items-center text-center pb-5 mb-5 border-b border-purple/[0.07]">
                <div className="w-16 h-16 rounded-full bg-grey-300 flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-white">{initials}</span>
                </div>
                <p className="text-base font-bold text-grey-900">
                  {patient.first_name} {patient.last_name}
                </p>
                {patient.phone && (
                  <p className="text-sm text-grey-500 mt-0.5">{patient.phone}</p>
                )}
              </div>
              <InfoRow label="Date of birth" value={patient.dob ? formatDate(patient.dob) : '—'} />
              <InfoRow label="Age" value={computeAge(patient.dob)} />
              <InfoRow label="Sex" value={patient.biological_sex ? patient.biological_sex.charAt(0).toUpperCase() + patient.biological_sex.slice(1) : '—'} />
            </Card>

            {/* Quick stats */}
            <Card>
              <CardHeader title="Activity" />
              <div className="flex flex-col gap-3">
                {[
                  { icon: Calendar, label: 'Total appointments', value: appointments.length },
                  { icon: Activity, label: 'Triage intakes', value: patient.triage_intakes?.length ?? 0 },
                  { icon: Clock, label: 'Last seen', value: appointments[0] ? formatDate(appointments[0].starts_at) : '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-purple-light flex items-center justify-center shrink-0">
                      <Icon size={14} strokeWidth={1.8} className="text-purple" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.8px] font-semibold text-grey-500">{label}</p>
                      <p className="text-sm font-bold text-grey-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* AI Insights / Latest triage */}
            <Card>
              <CardHeader title="AI triage insights" />
              {!latestIntake ? (
                <p className="text-sm text-grey-500">No triage data available.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <UrgencyBadge urgency={latestIntake.urgency as any} />
                    <span className="text-xs text-grey-500">{formatDate(latestIntake.updated_at)}</span>
                  </div>
                  {latestIntake.summary && (
                    <div className="p-4 rounded-lg bg-purple-light/60 border border-purple/[0.08]">
                      <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-purple mb-1.5">AI summary</p>
                      <p className="text-sm text-grey-900 leading-relaxed">{latestIntake.summary}</p>
                    </div>
                  )}
                  {latestIntake.answers && latestIntake.answers.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-grey-500 mb-3">Intake Q&A</p>
                      <div className="flex flex-col gap-3">
                        {latestIntake.answers.map((qa, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                              <span className="shrink-0 mt-0.5">
                                <User size={11} className="text-grey-300" />
                              </span>
                              <p className="text-xs font-medium text-grey-500">{qa.q}</p>
                            </div>
                            <p className="text-sm text-grey-900 pl-4">{qa.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Appointment history */}
            <Card>
              <CardHeader title="Appointment history" />
              {appointments.length === 0 ? (
                <p className="text-sm text-grey-500">No appointments yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple/[0.08]">
                      {['Date & time', 'Duration', 'Status', 'Reason'].map(h => (
                        <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.8px] text-grey-500 pb-3 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a.id} className="border-b border-purple/[0.04] last:border-0">
                        <td className="py-3 pr-4 text-grey-700 whitespace-nowrap">{formatDateTime(a.starts_at)}</td>
                        <td className="py-3 pr-4 text-grey-700">{a.duration_minutes} min</td>
                        <td className="py-3 pr-4"><StatusBadge status={a.status as any} /></td>
                        <td className="py-3 text-grey-500 text-xs">{a.reason ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>

            {/* All triage intakes */}
            {(patient.triage_intakes?.length ?? 0) > 1 && (
              <Card>
                <CardHeader title="Triage history" />
                <div className="flex flex-col gap-3">
                  {patient.triage_intakes!.slice(1).map(intake => (
                    <div key={intake.id} className="flex items-start gap-3 py-3 border-b border-purple/[0.05] last:border-0">
                      <UrgencyBadge urgency={intake.urgency as any} />
                      <div className="flex-1 min-w-0">
                        {intake.summary && (
                          <p className="text-sm text-grey-900 leading-relaxed line-clamp-2">{intake.summary}</p>
                        )}
                        <p className="text-xs text-grey-500 mt-1">{formatDate(intake.updated_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>
        </div>
      )}
    </AppShell>
  );
}
