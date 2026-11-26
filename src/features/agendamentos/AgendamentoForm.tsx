import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAgendamento, useUpdateAgendamento, useServicos, useProfissionais } from '../../api/hooks';
import { mensagemDeErro, useAuth } from '../../auth/AuthContext';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import { Agendamento } from '../../types';
import { doInputParaApi, formatPreco, paraInputLocal } from '../../utils/dateHelpers';

const schema = z.object({
  servicoId: z.number({ invalid_type_error: 'Escolha um serviço' }).min(1, 'Escolha um serviço'),
  profissionalId: z.number({ invalid_type_error: 'Escolha um profissional' }).min(1, 'Escolha um profissional'),
  data: z.string().min(1, 'Escolha data e horário'),
});

type FormData = z.infer<typeof schema>;

interface AgendamentoFormProps {
  agendamento?: Agendamento;
  onClose: () => void;
}

// O agendamento é sempre feito para quem está logado (a API usa o usuário do token).
const AgendamentoForm: React.FC<AgendamentoFormProps> = ({ agendamento, onClose }) => {
  const { sessao } = useAuth();
  const createMutation = useCreateAgendamento();
  const updateMutation = useUpdateAgendamento();
  const { data: servicos } = useServicos();
  const { data: profissionais } = useProfissionais();
  const [erro, setErro] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { servicoId: 0, profissionalId: 0, data: agendamento ? paraInputLocal(agendamento.data) : '' },
  });

  // A API devolve só os nomes; na edição, encontramos os ids pelos nomes
  useEffect(() => {
    if (!agendamento) return;
    const s = servicos?.find((x) => x.nome === agendamento.servico);
    const p = profissionais?.find((x) => x.nome === agendamento.profissional);
    if (s) setValue('servicoId', s.id);
    if (p) setValue('profissionalId', p.id);
  }, [agendamento, servicos, profissionais, setValue]);

  const onSubmit = async (data: FormData) => {
    setErro(null);
    const usuarioId = agendamento?.usuarioId ?? sessao!.usuarioId;
    const corpo = { usuarioId, servicoId: data.servicoId, profissionalId: data.profissionalId, data: doInputParaApi(data.data) };
    try {
      if (agendamento) await updateMutation.mutateAsync({ id: agendamento.id, ...corpo });
      else await createMutation.mutateAsync(corpo);
      onClose();
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível salvar o agendamento.'));
    }
  };

  const servicoOptions = servicos?.map((s) => ({ value: s.id, label: `${s.nome} · ${formatPreco(s.preco)} · ${s.duracaoMinutos} min` })) || [];
  const profissionalOptions = profissionais?.map((p) => ({ value: p.id, label: p.nome })) || [];
  const paraNumero = (v: string) => (v ? Number(v) : 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {erro && <Alert>{erro}</Alert>}
      <Select label="Serviço" value={watch('servicoId') || ''} onChange={(v) => setValue('servicoId', paraNumero(v), { shouldValidate: true })}
        options={servicoOptions} error={errors.servicoId?.message} required />
      <Select label="Profissional" value={watch('profissionalId') || ''} onChange={(v) => setValue('profissionalId', paraNumero(v), { shouldValidate: true })}
        options={profissionalOptions} error={errors.profissionalId?.message} required />
      <Input label="Data e horário" type="datetime-local" {...register('data')} error={errors.data?.message} required />
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando…' : 'Salvar'}</Button>
      </div>
    </form>
  );
};

export default AgendamentoForm;
