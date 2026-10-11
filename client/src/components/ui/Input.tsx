import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-steel-700 uppercase tracking-wider mb-1.5"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-steel-900 placeholder-steel-400 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-steel-50 disabled:text-steel-400 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-steel-300 hover:border-steel-400 focus:border-brand-blue focus:ring-blue-100'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {!error && helperText && (
          <p className="mt-1 text-xs text-steel-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
