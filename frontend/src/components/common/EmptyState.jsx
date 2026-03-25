import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '../ui/Button';

const EmptyState = ({ title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
      <div className="size-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
        <FileQuestion size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};

export default EmptyState;
