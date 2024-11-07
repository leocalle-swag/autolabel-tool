import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AutoLabelError } from '@/lib/types';

interface ErrorAlertProps {
  error: AutoLabelError | null;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>
        {error.message}
      </AlertDescription>
    </Alert>
  );
};
