export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
}

export interface UsuarioUpdate {
  id: string;
  nome: string;
  email: string;
}

export interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

export interface ServicoCreate {
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

export interface ServicoUpdate {
  id: number;
  nome: string;
  preco: number;
  duracaoMinutos: number;
}

export interface Profissional {
  id: number;
  nome: string;
}

export interface ProfissionalCreate {
  nome: string;
}

export interface ProfissionalUpdate {
  id: number;
  nome: string;
}

export interface Agendamento {
  id: string;
  data: string;
  usuarioId: string;
  cliente: string;
  servico: string;
  profissional: string;
}

export interface AgendamentoCreate {
  usuarioId: string;
  servicoId: number;
  profissionalId: number;
  data: string;
}

export interface AgendamentoUpdate {
  id: string;
  usuarioId: string;
  servicoId: number;
  profissionalId: number;
  data: string;
}