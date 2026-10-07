import type { ReactNode } from 'react';

interface AlertMessageProps {
  variant: 'success' | 'danger';
  children: ReactNode;
}

export function AlertMessage({ variant, children }: AlertMessageProps) {
  return (
    <div className={`alert alert-${variant}`} role={variant === 'danger' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
