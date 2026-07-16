import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Label } from './Label';
import { HelperText } from './HelperText';

interface FormGroupProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormGroup({ label, required, helperText, error, children, className }: FormGroupProps) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {error ? (
        <HelperText variant="error">{error}</HelperText>
      ) : helperText ? (
        <HelperText>{helperText}</HelperText>
      ) : null}
    </div>
  );
}
