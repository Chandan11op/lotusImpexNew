import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-steel-700 uppercase tracking-wider mb-1.5"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-steel-900 placeholder-steel-400 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-steel-50 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-steel-300 hover:border-steel-400 focus:border-brand-blue focus:ring-blue-100'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
