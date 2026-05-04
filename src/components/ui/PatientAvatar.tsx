import { useNavigate } from 'react-router-dom';

interface PatientAvatarProps {
  patientId: string;
  firstName: string | null;
  lastName: string | null;
}

export function PatientAvatar({ patientId, firstName, lastName }: PatientAvatarProps) {
  const navigate = useNavigate();
  const initials = [firstName, lastName]
    .map(n => n?.trim()[0]?.toUpperCase() ?? '')
    .join('') || '?';

  return (
    <button
      onClick={() => navigate(`/patients/${patientId}`)}
      className="flex items-center gap-3 group"
    >
      <div className="w-8 h-8 rounded-full bg-grey-300 flex items-center justify-center shrink-0 group-hover:bg-grey-500 transition-colors">
        <span className="text-[11px] font-semibold text-white leading-none">{initials}</span>
      </div>
      <span className="text-sm font-medium text-grey-900 group-hover:text-purple transition-colors">
        {firstName} {lastName}
      </span>
    </button>
  );
}
