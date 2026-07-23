import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  multiline = false,
  rows = 4,
  className = '',
  id,
  ...props
}) => {
  const inputClass = `
    w-full
    px-4 py-2.5
    rounded-xl
    bg-white/50 dark:bg-slate-900/50
    border ${error ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}
    text-slate-800 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
    transition-all duration-200
    ${className}
  `;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          className={inputClass}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClass}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <span className="text-xs text-red-500 ml-1 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
