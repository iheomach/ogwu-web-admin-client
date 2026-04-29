import { useEffect, useState } from 'react';
import { supabase } from './supabase';

type HospitalCtx = {
  hospitalId: string | null;
  hospitalName: string | null;
  loading: boolean;
};

export function useHospital(): HospitalCtx {
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [hospitalName, setHospitalName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from('hospitals_directory')
        .select('id, name')
        .eq('admin_user_id', user.id)
        .maybeSingle();

      setHospitalId(data?.id ?? null);
      setHospitalName(data?.name ?? null);
      setLoading(false);
    })();
  }, []);

  return { hospitalId, hospitalName, loading };
}
