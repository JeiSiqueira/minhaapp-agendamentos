import axios from 'axios';
import { lerSessao, limparSessao } from '../auth/session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Envia o token JWT da sessão em todas as chamadas
api.interceptors.request.use((config) => {
  const sessao = lerSessao();
  if (sessao) config.headers.Authorization = `Bearer ${sessao.token}`;
  return config;
});

// Endpoints de login/cadastro/senha: um 401 neles é "credenciais erradas", não "sessão expirada"
const ROTAS_PUBLICAS = ['/api/usuarios/login', '/api/usuarios/esqueci-senha', '/api/usuarios/redefinir-senha'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const url: string = error.config?.url ?? '';
      if (status === 401 && !ROTAS_PUBLICAS.some((r) => url.endsWith(r))) {
        // Token ausente ou expirado: volta para o login
        limparSessao();
        if (window.location.pathname !== '/login') window.location.assign('/login');
      } else if (status === 403) {
        console.error('Sem permissão para esta ação');
      } else if (status === 404) {
        console.error('Não encontrado');
      } else if (status === 400) {
        console.error('Dados inválidos', data);
      } else if (status >= 500) {
        console.error('Erro interno do servidor');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
