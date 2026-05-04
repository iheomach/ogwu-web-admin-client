import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OgwuLogo } from '../components/ui/OgwuLogo';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-10">
          <OgwuLogo size={52} />
        </div>

        <h1 className="text-[28px] font-bold text-grey-900 tracking-[-0.5px] mb-1">
          Hospital portal
        </h1>
        <p className="text-sm text-grey-500 mb-8">Sign in to manage appointments and consults.</p>

        <form onSubmit={handleSubmit} className="card p-6">
          <Input
            label="Email"
            type="email"
            placeholder="you@hospital.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-error mb-4">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full mt-1" size="lg">
            Sign in
          </Button>
        </form>

        <p className="text-center text-xs text-grey-500 mt-6">
          Access is restricted to registered hospital staff.
          <br />
          Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}
