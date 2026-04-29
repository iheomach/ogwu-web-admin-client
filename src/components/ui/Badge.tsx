import type { UrgencyTier } from '../../lib/types';

interface BadgeProps {
  label: string;
  color?: 'purple' | 'error' | 'warning' | 'urgent' | 'success' | 'grey';
}

const colorClasses: Record<string, string> = {
  purple: 'bg-purple-light text-purple border border-purple/14',
  error: 'bg-error-light text-error border border-error/20',
  warning: 'bg-warning-light text-warning border border-warning/20',
  urgent: 'bg-urgent-light text-urgent border border-urgent/20',
  success: 'bg-success-light text-success border border-success/20',
  grey: 'bg-grey-100 text-grey-500 border border-grey-300',
};

export function Badge({ label, color = 'grey' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.3px]',
        colorClasses[color],
      ].join(' ')}
    >
      {label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyTier }) {
  const map: Record<UrgencyTier, { label: string; color: BadgeProps['color'] }> = {
    emergency: { label: 'Emergency', color: 'error' },
    urgent: { label: 'Urgent', color: 'urgent' },
    soon: { label: 'Soon', color: 'warning' },
    routine: { label: 'Routine', color: 'success' },
  };
  const { label, color } = map[urgency] ?? map.routine;
  return <Badge label={label} color={color} />;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: BadgeProps['color'] }> = {
    scheduled: { label: 'Scheduled', color: 'purple' },
    confirmed: { label: 'Confirmed', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    completed: { label: 'Completed', color: 'grey' },
    open: { label: 'Open', color: 'warning' },
    closed: { label: 'Closed', color: 'grey' },
  };
  const { label, color } = map[status] ?? { label: status, color: 'grey' };
  return <Badge label={label} color={color} />;
}
