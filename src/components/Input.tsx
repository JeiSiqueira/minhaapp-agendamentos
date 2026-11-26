import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// forwardRef permite usar o componente com `{...register('campo')}` do react-hook-form
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', error, required = false, id, className = '', ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="mb-5">
        <label htmlFor={inputId} className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
          {label} {required && <span className="text-pink-400">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={`w-full rounded-lg border px-3 py-2.5 text-gray-800 placeholder-gray-300 outline-none transition
            focus:border-pink-400 focus:ring-2 focus:ring-pink-100 ${error ? 'border-rose-400' : 'border-gray-200'} ${className}`}
          {...rest}
        />
        {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
