import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AppShell, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

type HospitalSettings = {
  name: string;
  phone: string;
  location: string;
  admin1: string;
  country: string;
};

export function SettingsPage() {
  const [settings, setSettings] = useState<HospitalSettings>({
    name: '', phone: '', location: '', admin1: '', country: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      const { data } = await supabase
        .from('hospitals_directory')
        .select('name, phone, location, admin1, country')
        .eq('admin_user_id', user.id)
        .maybeSingle();

      if (mounted) {
        if (data) setSettings(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('hospitals_directory')
      .update(settings)
      .eq('admin_user_id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (key: keyof HospitalSettings) => ({
    value: settings[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSettings(prev => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <AppShell>
      <PageHeader title="Settings" subtitle="Manage your hospital profile and account." />

      <div className="max-w-xl flex flex-col gap-6">

        <Card>
          <CardHeader title="Hospital profile" subtitle="This information is shown to patients when booking." />
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-purple border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <Input label="Hospital name" placeholder="Lagos University Teaching Hospital" {...field('name')} />
              <Input label="Phone" placeholder="+234 ..." {...field('phone')} />
              <Input label="City / address" placeholder="Idi-Araba, Lagos" {...field('location')} />
              <Input label="State / province" placeholder="Lagos" {...field('admin1')} />
              <Input label="Country" placeholder="Nigeria" {...field('country')} />
              <Button onClick={handleSave} loading={saving} size="lg" className="w-full mt-2">
                {saved ? 'Saved!' : 'Save changes'}
              </Button>
            </>
          )}
        </Card>

        <Card>
          <CardHeader title="Google Calendar" subtitle="Used for appointment slot availability and Meet links." />
          <p className="text-sm text-grey-500 mb-4">
            Calendar integration is managed from the backend. Connect via the admin auth flow in your Railway deployment.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-grey-700 font-medium">Connected</span>
          </div>
        </Card>

      </div>
    </AppShell>
  );
}
