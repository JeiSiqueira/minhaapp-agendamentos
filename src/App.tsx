import React, { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './features/dashboard/Dashboard';
import Servicos from './features/servicos/Servicos';
import Profissionais from './features/profissionais/Profissionais';
import Agendamentos from './features/agendamentos/Agendamentos';
import Login from './features/auth/Login';
import Cadastro from './features/auth/Cadastro';
import EsqueciSenha from './features/auth/EsqueciSenha';
import { AuthProvider, RequireAuth, useAuth } from './auth/AuthContext';
import { formatarNome } from './utils/textHelpers';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/agendamentos', label: 'Agendamentos' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/profissionais', label: 'Profissionais' },
];

const linkClasse = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-pink-50 font-medium text-pink-600' : 'text-gray-500 hover:text-gray-800'}`;

// Layout das telas internas (só para quem está logado)
const AreaLogada: React.FC = () => {
  const { sessao, sair } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  // Fecha o menu do celular ao trocar de tela
  useEffect(() => setMenuAberto(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 whitespace-nowrap">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
              <span className="h-2.5 w-2.5 rounded-full bg-pink-400" />
            </span>
            <span className="font-light tracking-wide text-gray-800">Agendamentos</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasse}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-4 md:flex">
            <span className="max-w-[12rem] truncate text-sm text-gray-500">{formatarNome(sessao?.nome)}</span>
            <button onClick={sair} className="rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-pink-600 transition hover:bg-pink-50">
              Sair
            </button>
          </div>

          <button
            className="ml-auto rounded-lg p-2 text-gray-500 transition hover:bg-pink-50 hover:text-pink-600 md:hidden"
            onClick={() => setMenuAberto((v) => !v)}
            aria-expanded={menuAberto}
            aria-controls="menu-celular"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6" aria-hidden="true">
              {menuAberto
                ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {menuAberto && (
          <div id="menu-celular" className="border-t border-pink-100 bg-white px-4 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Principal">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClasse}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-pink-50 pt-3">
              <span className="truncate text-sm text-gray-500">{formatarNome(sessao?.nome)}</span>
              <button onClick={sair} className="rounded-lg border border-pink-200 px-3 py-1.5 text-sm text-pink-600">
                Sair
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Telas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />

            {/* Telas internas */}
            <Route element={<RequireAuth><AreaLogada /></RequireAuth>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/profissionais" element={<Profissionais />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
