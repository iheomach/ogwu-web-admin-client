import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className = '', glass: useGlass = false }: CardProps) {
  return (
    <div className={[useGlass ? 'glass' : 'card', 'p-6', className].join(' ')}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-base font-semibold text-grey-900 tracking-[-0.2px]">{title}</h2>
        {subtitle && <p className="text-sm text-grey-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
