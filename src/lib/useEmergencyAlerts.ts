import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type EmergencyAlert = {
  id: string;
  patient_id: string;
  reason: string | null;
  created_at: string;
  patient: { first_name: string | null; last_name: string | null } | null;
};

export function useEmergencyAlerts(hospitalId: string | null) {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  useEffect(() => {
    if (!hospitalId) return;

    supabase
      .from('emergency_alerts')
      .select('id, patient_id, reason, created_at, patient:profiles(first_name, last_name)')
      .eq('hospital_id', hospitalId)
      .is('acknowledged_at', null)
      .order('created_at', { ascending: false })
      .then(({ data }) => setAlerts((data as unknown as EmergencyAlert[]) ?? []));

    const channel = supabase
      .channel(`emergency:${hospitalId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'emergency_alerts', filter: `hospital_id=eq.${hospitalId}` },
        async (payload) => {
          const { data } = await supabase
            .from('emergency_alerts')
            .select('id, patient_id, reason, created_at, patient:profiles(first_name, last_name)')
            .eq('id', payload.new.id)
            .single();
          if (data) setAlerts(prev => [data as unknown as EmergencyAlert, ...prev]);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [hospitalId]);

  const acknowledge = async (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    await supabase
      .from('emergency_alerts')
      .update({ acknowledged_at: new Date().toISOString() })
      .eq('id', id);
  };

  return { alerts, acknowledge };
}
