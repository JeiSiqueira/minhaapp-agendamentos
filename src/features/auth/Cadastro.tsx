import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { mensagemDeErro, useAuth } from '../../auth/AuthContext';
import { AuthLayout, Aviso, BotaoPrimario, Campo } from './AuthLayout';

// Mesmos campos e regras do formulário "Criar Usuário" (UsuarioForm)
const schema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
type FormData = z.infer<typeof schema>;

const Cadastro: React.FC = () => {
  const { sessao, cadastrar } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (sessao) return <Navigate to="/" replace />;

  const onSubmit = async (data: FormData) => {
    setErro(null);
    try {
      await cadastrar({ nome: data.nome.trim(), email: data.email.trim(), senha: data.senha });
      navigate('/', { replace: true });
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível criar o usuário.'));
    }
  };

  return (
    <AuthLayout titulo="Criar usuário" subtitulo="Leva menos de um minuto">
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Campo label="Nome" autoComplete="name" placeholder="Seu nome" {...register('nome')} erro={errors.nome?.message} />
        <Campo label="Email" type="email" autoComplete="email" placeholder="voce@email.com"
          {...register('email')} erro={errors.email?.message} />
        <Campo label="Senha" type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres"
          {...register('senha')} erro={errors.senha?.message} />
        <BotaoPrimario type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? 'Criando…' : 'Criar usuário'}
        </BotaoPrimario>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Já tem conta?{' '}
        <Link to="/login" className="text-pink-500 hover:text-pink-700 hover:underline">Entrar</Link>
      </p>
    </AuthLayout>
  );
};

export default Cadastro;
