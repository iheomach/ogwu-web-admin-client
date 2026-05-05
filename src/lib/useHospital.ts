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

      const { data, error } = await supabase
        .from('hospitals_directory')
        .select('id, name')
        .eq('admin_user_id', user.id)
        .maybeSingle();

      if (error) console.error('[useHospital] lookup error:', error.message, '— uid:', user.id);
      if (!data && !error) console.warn('[useHospital] no hospital row found for uid:', user.id, '— run: UPDATE hospitals_directory SET admin_user_id = \'' + user.id + '\' WHERE id = \'<your-hospital-id>\'');

      setHospitalId(data?.id ?? null);
      setHospitalName(data?.name ?? null);
      setLoading(false);
    })();
  }, []);

  return { hospitalId, hospitalName, loading };
}
