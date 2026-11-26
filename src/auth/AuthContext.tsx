import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Sessao, ehAdmin, lerSessao, limparSessao, salvarSessao } from './session';
import { UsuarioCreate } from '../types';

interface AuthContextValue {
  sessao: Sessao | null;
  admin: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (dados: UsuarioCreate) => Promise<void>;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessao, setSessao] = useState<Sessao | null>(() => lerSessao());
  const queryClient = useQueryClient();

  const iniciar = useCallback((s: Sessao) => {
    salvarSessao(s);
    queryClient.clear(); // não reaproveita dados carregados por outro usuário
    setSessao(s);
  }, [queryClient]);

  const entrar = useCallback(async (email: string, senha: string) => {
    const { data } = await api.post<Sessao>('/api/usuarios/login', { email, senha });
    iniciar({ usuarioId: data.usuarioId, nome: data.nome, email: data.email, token: data.token });
  }, [iniciar]);

  const cadastrar = useCallback(async (dados: UsuarioCreate) => {
    // O cadastro já devolve o token: a pessoa entra direto
    const { data } = await api.post<Sessao>('/api/usuarios', dados);
    iniciar({ usuarioId: data.usuarioId, nome: data.nome, email: data.email, token: data.token });
  }, [iniciar]);

  const sair = useCallback(() => {
    limparSessao();
    queryClient.clear();
    setSessao(null);
  }, [queryClient]);

  const value = useMemo(
    () => ({ sessao, admin: sessao ? ehAdmin(sessao.token) : false, entrar, cadastrar, sair }),
    [sessao, entrar, cadastrar, sair]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}

/** Protege as rotas internas: sem sessão, manda para o login. */
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sessao } = useAuth();
  const location = useLocation();
  if (!sessao) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
};

/** Mensagem de erro amigável a partir da resposta da API. */
export function mensagemDeErro(error: unknown, padrao = 'Não foi possível concluir. Tente novamente.') {
  const resp = (error as { response?: { status?: number; data?: { message?: string } } })?.response;
  if (resp?.status === 429) return 'Muitas tentativas. Aguarde um minuto e tente de novo.';
  return resp?.data?.message ?? padrao;
}
