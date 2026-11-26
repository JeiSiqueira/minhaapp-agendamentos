import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProfissional, useUpdateProfissional } from '../../api/hooks';
import { mensagemDeErro } from '../../auth/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Alert from '../../components/Alert';
import { Profissional } from '../../types';

const schema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
});

type FormData = z.infer<typeof schema>;

interface ProfissionalFormProps {
  profissional?: Profissional;
  onClose: () => void;
}

const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ profissional, onClose }) => {
  const createMutation = useCreateProfissional();
  const updateMutation = useUpdateProfissional();
  const [erro, setErro] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: profissional ? { nome: profissional.nome } : {},
  });

  const onSubmit = async (data: FormData) => {
    setErro(null);
    try {
      if (profissional) await updateMutation.mutateAsync({ id: profissional.id, nome: data.nome });
      else await createMutation.mutateAsync(data);
      onClose();
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível salvar o profissional.'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {erro && <Alert>{erro}</Alert>}
      <Input label="Nome" placeholder="Nome do profissional" {...register('nome')} error={errors.nome?.message} required />
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando…' : 'Salvar'}</Button>
      </div>
    </form>
  );
};

export default ProfissionalForm;
