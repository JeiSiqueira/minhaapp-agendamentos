import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  required?: boolean;
  id?: string;
}

const Select: React.FC<SelectProps> = ({ label, value, onChange, options, error, required = false, id }) => {
  const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="mb-5">
      <label htmlFor={selectId} className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
        {label} {required && <span className="text-pink-400">*</span>}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-gray-800 outline-none transition
          focus:border-pink-400 focus:ring-2 focus:ring-pink-100 ${error ? 'border-rose-400' : 'border-gray-200'}`}
      >
        <option value="">Selecione...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default Select;
