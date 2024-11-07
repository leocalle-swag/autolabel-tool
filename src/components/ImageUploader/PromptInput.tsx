

import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean; // Aggiunta questa prop
}

const PromptInput: React.FC<PromptInputProps> = ({ 
    value, 
    onChange,
    disabled = false
 }) => (
  <Textarea
    placeholder="write ur prompt for the classification.."
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="mt-6"
  />
);

export default PromptInput;