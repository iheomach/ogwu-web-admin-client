import { type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useHospital } from '../../lib/useHospital';
import { useEmergencyAlerts, type EmergencyAlert } from '../../lib/useEmergencyAlerts';

function EmergencyBanner({ alert, onAcknowledge }: { alert: EmergencyAlert; onAcknowledge: (id: string) => void }) {
  const name = [alert.patient?.first_name, alert.patient?.last_name].filter(Boolean).join(' ') || 'A patient';
  const time = new Date(alert.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="flex items-start gap-3 bg-red-600 text-white px-5 py-3">
      <AlertTriangle size={18} className="shrink-0 mt-0.5" strokeWidth={2.5} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">
          Emergency — {name} · {time}
        </p>
        {alert.reason && (
          <p className="text-xs text-red-100 mt-0.5 leading-snug">{alert.reason}</p>
        )}
      </div>
      <button
        onClick={() => onAcknowledge(alert.id)}
        className="shrink-0 p-1 rounded hover:bg-red-700 transition-colors"
        title="Acknowledge"
      >
        <X size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { hospitalId } = useHospital();
  const { alerts, acknowledge } = useEmergencyAlerts(hospitalId);

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {alerts.length > 0 && (
        <div className="flex flex-col w-full z-50 shrink-0">
          {alerts.map(a => (
            <EmergencyBanner key={a.id} alert={a} onAcknowledge={acknowledge} />
          ))}
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-grey-900 tracking-[-0.5px]">{title}</h1>
        {subtitle && <p className="text-sm text-grey-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
