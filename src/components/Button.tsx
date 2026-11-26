import React from 'react';

// Mesma paleta das telas de acesso (rosa, minimalista)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-200',
  secondary: 'border border-pink-200 bg-white text-pink-600 hover:bg-pink-50 focus:ring-pink-100',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-200',
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...rest
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium tracking-wide transition
      focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60
      ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
