import { useEffect, useState } from 'react';
import { CalendarDays, MessageSquare, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Appointment, ConsultThread } from '../lib/types';
import { AppShell, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { UrgencyBadge, StatusBadge } from '../components/ui/Badge';

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: accent ? `${accent}15` : 'rgba(69,0,80,0.07)' }}
      >
        <Icon size={20} color={accent ?? '#450050'} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.8px] text-grey-500">{label}</p>
        <p className="text-2xl font-bold text-grey-900 tracking-[-0.5px]">{value}</p>
      </div>
    </div>
  );
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consults, setConsults] = useState<ConsultThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [apptRes, consultRes] = await Promise.all([
        supabase
          .from('appointments')
          .select('*, patient:profiles(first_name, last_name, phone)')
          .gte('starts_at', today.toISOString())
          .order('starts_at', { ascending: true })
          .limit(5),
        supabase
          .from('consult_threads')
          .select('*, patient:profiles(first_name, last_name, phone)')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (!mounted) return;
      setAppointments(apptRes.data ?? []);
      setConsults(consultRes.data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const todayCount = appointments.filter(a => {
    const d = new Date(a.starts_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <AppShell>
      <PageHeader title="Dashboard" subtitle="Welcome back. Here's what's happening today." />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Today's appointments" value={loading ? '—' : todayCount} icon={CalendarDays} />
        <StatCard label="Open consults" value={loading ? '—' : consults.length} icon={MessageSquare} accent="#F97316" />
        <StatCard label="Upcoming (7 days)" value={loading ? '—' : appointments.length} icon={Clock} accent="#16A34A" />
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Upcoming appointments */}
        <Card>
          <CardHeader title="Upcoming appointments" />
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-grey-500 py-4">No upcoming appointments.</p>
          ) : (
            <div className="flex flex-col divide-y divide-purple/[0.06]">
              {appointments.map(a => (
                <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-grey-900 truncate">
                      {a.patient?.first_name} {a.patient?.last_name}
                    </p>
                    <p className="text-xs text-grey-500 mt-0.5">{formatDateTime(a.starts_at)}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Open consults */}
        <Card>
          <CardHeader title="Open consults" />
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : consults.length === 0 ? (
            <p className="text-sm text-grey-500 py-4">No open consults.</p>
          ) : (
            <div className="flex flex-col divide-y divide-purple/[0.06]">
              {consults.map(c => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-grey-900 truncate">
                      {c.patient?.first_name} {c.patient?.last_name}
                    </p>
                    <p className="text-xs text-grey-500 mt-0.5">{formatDateTime(c.created_at)}</p>
                  </div>
                  <UrgencyBadge urgency={c.urgency} />
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </AppShell>
  );
}
