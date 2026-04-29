import { useEffect, useState } from 'react';
import { Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHospital } from '../lib/useHospital';
import type { Appointment } from '../lib/types';
import { AppShell, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AppointmentsPage() {
  const { hospitalId, loading: hospitalLoading } = useHospital();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (hospitalLoading || !hospitalId) return;
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*, patient:profiles(first_name, last_name, phone)')
        .eq('hospital_id', hospitalId)
        .order('starts_at', { ascending: true });
      if (mounted) {
        setAppointments(data ?? []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [hospitalId, hospitalLoading]);

  const updateStatus = async (id: string, status: Appointment['status']) => {
    setUpdating(id);
    const { data } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (data) {
      setAppointments(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    }
    setUpdating(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Appointments"
        subtitle="Manage scheduled appointments and video consults."
      />

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-medium text-grey-900">No appointments yet</p>
            <p className="text-sm text-grey-500 mt-1">Appointments booked through Ogwu will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple/[0.08]">
                {['Patient', 'Date & time', 'Duration', 'Status', 'Meet', ''].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.8px] text-grey-500 pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} className="border-b border-purple/[0.04] last:border-0">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-grey-900">
                      {a.patient?.first_name} {a.patient?.last_name}
                    </p>
                    {a.patient?.phone && (
                      <p className="text-xs text-grey-500 mt-0.5">{a.patient.phone}</p>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-grey-700 whitespace-nowrap">
                    {formatDateTime(a.starts_at)}
                  </td>
                  <td className="py-4 pr-4 text-grey-700">{a.duration_minutes} min</td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-4 pr-4">
                    {a.meeting_url ? (
                      <a
                        href={a.meeting_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-purple hover:underline"
                      >
                        <Video size={13} strokeWidth={2} />
                        Join
                      </a>
                    ) : (
                      <span className="text-xs text-grey-300">—</span>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {a.status === 'scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          loading={updating === a.id}
                          onClick={() => updateStatus(a.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                      )}
                      {(a.status === 'scheduled' || a.status === 'confirmed') && (
                        <Button
                          variant="destructive"
                          size="sm"
                          loading={updating === a.id}
                          onClick={() => updateStatus(a.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </AppShell>
  );
}
