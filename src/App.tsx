import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ConsultsPage } from './pages/ConsultsPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function Spinner() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-purple border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Spinner />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected */}
        <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/login" replace />} />
        <Route path="/appointments" element={session ? <AppointmentsPage /> : <Navigate to="/login" replace />} />
        <Route path="/consults" element={session ? <ConsultsPage /> : <Navigate to="/login" replace />} />
        <Route path="/patients" element={session ? <PatientsPage /> : <Navigate to="/login" replace />} />
        <Route path="/patients/:id" element={session ? <PatientProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={session ? <SettingsPage /> : <Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
