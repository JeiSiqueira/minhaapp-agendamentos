import React from 'react';

// Visual das telas de acesso: rosa claro, cartão branco, poucos elementos.

export const AuthLayout: React.FC<{ titulo: string; subtitulo?: string; children: React.ReactNode }> = ({
  titulo,
  subtitulo,
  children,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-10">
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
          <span className="h-3 w-3 rounded-full bg-pink-400" />
        </div>
        <h1 className="text-2xl font-light tracking-wide text-gray-800">{titulo}</h1>
        {subtitulo && <p className="mt-2 text-sm text-gray-500">{subtitulo}</p>}
      </div>
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm shadow-pink-100 p-8">{children}</div>
    </div>
  </div>
);

interface CampoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  erro?: string;
}

export const Campo = React.forwardRef<HTMLInputElement, CampoProps>(({ label, erro, id, className = '', ...rest }, ref) => {
  const campoId = id ?? rest.name;
  return (
    <div className="mb-5">
      <label htmlFor={campoId} className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
        {label}
      </label>
      <input
        ref={ref}
        id={campoId}
        className={`w-full rounded-lg border px-3 py-2.5 text-gray-800 placeholder-gray-300 outline-none transition
          focus:border-pink-400 focus:ring-2 focus:ring-pink-100 ${erro ? 'border-rose-400' : 'border-gray-200'} ${className}`}
        {...rest}
      />
      {erro && <p className="mt-1.5 text-xs text-rose-500">{erro}</p>}
    </div>
  );
});
Campo.displayName = 'Campo';

export const BotaoPrimario: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    className={`w-full rounded-lg bg-pink-500 py-2.5 text-sm font-medium tracking-wide text-white transition
      hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-200 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const BotaoSecundario: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => (
  <button
    className={`w-full rounded-lg border border-pink-200 bg-white py-2.5 text-sm font-medium tracking-wide text-pink-600 transition
      hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-100 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const Aviso: React.FC<{ tipo: 'erro' | 'sucesso'; children: React.ReactNode }> = ({ tipo, children }) => (
  <div
    role={tipo === 'erro' ? 'alert' : 'status'}
    className={`mb-5 rounded-lg px-3 py-2.5 text-sm ${tipo === 'erro' ? 'bg-rose-50 text-rose-600' : 'bg-pink-50 text-pink-700'}`}
  >
    {children}
  </div>
);
