import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { Usuario, UsuarioCreate, UsuarioUpdate, Servico, ServicoCreate, ServicoUpdate, Profissional, ProfissionalCreate, ProfissionalUpdate, Agendamento, AgendamentoCreate, AgendamentoUpdate } from '../types';

// Usuarios
export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await api.get<Usuario[]>('/api/usuarios');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUsuario = (id: string) => {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: async () => {
      const response = await api.get<Usuario>(`/api/usuarios/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (usuario: UsuarioCreate) => {
      const response = await api.post('/api/usuarios', usuario);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (usuario: UsuarioUpdate) => {
      const response = await api.put('/api/usuarios', usuario);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/usuarios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

// Servicos
export const useServicos = () => {
  return useQuery({
    queryKey: ['servicos'],
    queryFn: async () => {
      const response = await api.get<Servico[]>('/api/servicos');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useServico = (id: number) => {
  return useQuery({
    queryKey: ['servicos', id],
    queryFn: async () => {
      const response = await api.get<Servico>(`/api/servicos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateServico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (servico: ServicoCreate) => {
      const response = await api.post('/api/servicos', servico);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
    },
  });
};

export const useUpdateServico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (servico: ServicoUpdate) => {
      const response = await api.put('/api/servicos', servico);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
    },
  });
};

export const useDeleteServico = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/servicos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
    },
  });
};

// Profissionais
export const useProfissionais = () => {
  return useQuery({
    queryKey: ['profissionais'],
    queryFn: async () => {
      const response = await api.get<Profissional[]>('/api/profissionais');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProfissional = (id: number) => {
  return useQuery({
    queryKey: ['profissionais', id],
    queryFn: async () => {
      const response = await api.get<Profissional>(`/api/profissionais/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProfissional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profissional: ProfissionalCreate) => {
      const response = await api.post('/api/profissionais', profissional);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
    },
  });
};

export const useUpdateProfissional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profissional: ProfissionalUpdate) => {
      const response = await api.put('/api/profissionais', profissional);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
    },
  });
};

export const useDeleteProfissional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/profissionais/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profissionais'] });
    },
  });
};

// Agendamentos
export const useAgendamentos = () => {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      const response = await api.get<Agendamento[]>('/api/Agendamentos');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAgendamento = (id: string) => {
  return useQuery({
    queryKey: ['agendamentos', id],
    queryFn: async () => {
      const response = await api.get<Agendamento>(`/api/Agendamentos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateAgendamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agendamento: AgendamentoCreate) => {
      const response = await api.post('/api/Agendamentos', agendamento);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};

export const useUpdateAgendamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agendamento: AgendamentoUpdate) => {
      const response = await api.put('/api/Agendamentos', agendamento);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};

export const useDeleteAgendamento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/Agendamentos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};