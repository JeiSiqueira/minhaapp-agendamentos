// Sessão do usuário logado, guardada no localStorage para sobreviver a um F5.

export interface Sessao {
  usuarioId: string;
  nome: string;
  email: string;
  token: string;
}

const CHAVE = 'agendamentos.sessao';

function lerPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/** Lê o campo "exp" (em segundos) do JWT. */
function expiraEm(token: string): number | null {
  const exp = lerPayload(token)?.exp;
  return typeof exp === 'number' ? exp * 1000 : null;
}

/**
 * Indica se o token tem o perfil "admin". Serve só para esconder botões:
 * quem garante a permissão de verdade é a API.
 */
export function ehAdmin(token: string): boolean {
  const role = lerPayload(token)?.role;
  return role === 'admin' || (Array.isArray(role) && role.includes('admin'));
}

export function lerSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return null;
    const sessao = JSON.parse(bruto) as Sessao;
    const exp = expiraEm(sessao.token);
    if (!exp || exp <= Date.now()) {
      localStorage.removeItem(CHAVE);
      return null;
    }
    return sessao;
  } catch {
    localStorage.removeItem(CHAVE);
    return null;
  }
}

export function salvarSessao(sessao: Sessao) {
  localStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export function limparSessao() {
  localStorage.removeItem(CHAVE);
}
