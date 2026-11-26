import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateServico, useUpdateServico } from '../../api/hooks';
import { mensagemDeErro } from '../../auth/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import { Servico } from '../../types';

const schema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  preco: z.number({ invalid_type_error: 'Informe o preço' }).min(0.01, 'Preço deve ser maior que 0'),
  duracaoMinutos: z.number({ invalid_type_error: 'Informe a duração' }).int('Use minutos inteiros').min(1, 'Duração deve ser maior que 0'),
});

type FormData = z.infer<typeof schema>;

interface ServicoFormProps {
  servico?: Servico;
  onClose: () => void;
}

const ServicoForm: React.FC<ServicoFormProps> = ({ servico, onClose }) => {
  const createMutation = useCreateServico();
  const updateMutation = useUpdateServico();
  const [erro, setErro] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: servico ? { nome: servico.nome, preco: servico.preco, duracaoMinutos: servico.duracaoMinutos } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    setErro(null);
    try {
      if (servico) await updateMutation.mutateAsync({ id: servico.id, ...data });
      else await createMutation.mutateAsync(data);
      onClose();
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível salvar o serviço.'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {erro && <Alert>{erro}</Alert>}
      <Input label="Nome" placeholder="Ex.: Corte de cabelo" {...register('nome')} error={errors.nome?.message} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Preço (R$)" type="number" step="0.01" min="0" inputMode="decimal"
          {...register('preco', { valueAsNumber: true })} error={errors.preco?.message} required />
        <Input label="Duração (min)" type="number" step="1" min="1" inputMode="numeric"
          {...register('duracaoMinutos', { valueAsNumber: true })} error={errors.duracaoMinutos?.message} required />
      </div>
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando…' : 'Salvar'}</Button>
      </div>
    </form>
  );
};

export default ServicoForm;
