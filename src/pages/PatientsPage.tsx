import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useHospital } from '../lib/useHospital';
import { AppShell, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { UrgencyBadge } from '../components/ui/Badge';

type PatientRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  biological_sex: string | null;
  dob: string | null;
  triage_intakes?: Array<{
    urgency: string;
    summary: string | null;
    updated_at: string;
  }>;
};

function computeAge(dob: string | null): string {
  if (!dob) return '—';
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '—';
  const age = new Date().getFullYear() - d.getFullYear();
  return `${age}`;
}

export function PatientsPage() {
  const { hospitalId, loading: hospitalLoading } = useHospital();
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (hospitalLoading || !hospitalId) return;
    let mounted = true;
    (async () => {
      // Get the distinct patient IDs who have interacted with this hospital
      const { data: apptRows } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('hospital_id', hospitalId);

      const patientIds = [...new Set((apptRows ?? []).map(r => r.patient_id))];
      if (!patientIds.length) {
        if (mounted) { setPatients([]); setLoading(false); }
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, phone, biological_sex, dob, triage_intakes(urgency, summary, updated_at)')
        .in('id', patientIds)
        .order('created_at', { ascending: false });

      if (mounted) { setPatients(data ?? []); setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [hospitalId, hospitalLoading]);

  const filtered = patients.filter(p => {
    const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (p.phone ?? '').includes(search);
  });

  return (
    <AppShell>
      <PageHeader title="Patients" subtitle="Registered patients who have interacted with Ogwu." />

      <div className="mb-5">
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="glass rounded-md px-4 py-3 text-sm w-full max-w-sm outline-none focus:border-purple focus:border-[1.5px] placeholder:text-grey-300 transition-colors"
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-grey-500 py-8 text-center">No patients found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple/[0.08]">
                {['Name', 'Phone', 'Age', 'Sex', 'Triage status', 'Last intake'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[0.8px] text-grey-500 pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const intake = p.triage_intakes?.[0];
                return (
                  <tr key={p.id} className="border-b border-purple/[0.04] last:border-0">
                    <td className="py-3.5 pr-4 font-medium text-grey-900">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="py-3.5 pr-4 text-grey-700">{p.phone ?? '—'}</td>
                    <td className="py-3.5 pr-4 text-grey-700">{computeAge(p.dob)}</td>
                    <td className="py-3.5 pr-4 text-grey-700 capitalize">{p.biological_sex ?? '—'}</td>
                    <td className="py-3.5 pr-4">
                      {intake
                        ? <UrgencyBadge urgency={intake.urgency as any} />
                        : <span className="text-grey-300">—</span>
                      }
                    </td>
                    <td className="py-3.5 text-grey-500">
                      {intake
                        ? new Date(intake.updated_at).toLocaleDateString()
                        : '—'
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </AppShell>
  );
}
