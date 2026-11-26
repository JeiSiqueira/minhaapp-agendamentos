import React from 'react';

const Alert: React.FC<{ tipo?: 'erro' | 'info'; children: React.ReactNode }> = ({ tipo = 'erro', children }) => (
  <div
    role={tipo === 'erro' ? 'alert' : 'status'}
    className={`mb-5 rounded-lg px-4 py-3 text-sm ${tipo === 'erro' ? 'bg-rose-50 text-rose-600' : 'bg-pink-50 text-pink-700'}`}
  >
    {children}
  </div>
);

export default Alert;
