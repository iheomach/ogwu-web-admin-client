export type UrgencyTier = 'routine' | 'soon' | 'urgent' | 'emergency';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export type Hospital = {
  id: string;
  name: string;
  location: string;
  admin1: string;
  country: string;
  phone: string | null;
  is_onboarded: boolean;
};

export type Appointment = {
  id: string;
  patient_id: string;
  hospital_id: string;
  doctor_id: string | null;
  starts_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  meeting_url: string | null;
  reason: string | null;
  patient_time_zone: string;
  provider_time_zone: string;
  created_at: string;
  patient?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
};

export type ConsultThread = {
  id: string;
  patient_id: string;
  provider_type: 'onboarded' | 'external';
  doctor_id: string | null;
  locale: string | null;
  urgency: UrgencyTier;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  intake_snapshot: {
    urgency: UrgencyTier;
    summary: string | null;
    answers: Array<{ q: string; a: string }>;
  } | null;
  patient?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
};

export type ConsultMessage = {
  id: string;
  thread_id: string;
  sender_role: 'patient' | 'provider' | 'system';
  body: string;
  created_at: string;
};

export type DashboardStats = {
  todayAppointments: number;
  pendingConsults: number;
  totalPatients: number;
  upcomingAppointments: Appointment[];
  recentConsults: ConsultThread[];
};
