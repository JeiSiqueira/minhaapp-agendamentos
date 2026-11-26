import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { mensagemDeErro, useAuth } from '../../auth/AuthContext';
import { AuthLayout, Aviso, BotaoPrimario, BotaoSecundario, Campo } from './AuthLayout';

const schema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(1, 'Informe a senha'),
});
type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { sessao, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const estado = location.state as { from?: string; mensagem?: string; email?: string } | null;
  const [erro, setErro] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: estado?.email ?? '' },
  });

  if (sessao) return <Navigate to="/" replace />;

  const onSubmit = async (data: FormData) => {
    setErro(null);
    try {
      await entrar(data.email.trim(), data.senha);
      navigate(estado?.from ?? '/', { replace: true });
    } catch (e) {
      setErro(mensagemDeErro(e, 'E-mail ou senha incorretos.'));
    }
  };

  return (
    <AuthLayout titulo="Entrar" subtitulo="Acesse para ver seus agendamentos">
      {estado?.mensagem && !erro && <Aviso tipo="sucesso">{estado.mensagem}</Aviso>}
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Campo label="Usuário (e-mail)" type="email" autoComplete="username" placeholder="voce@email.com"
          {...register('email')} erro={errors.email?.message} />
        <Campo label="Senha" type="password" autoComplete="current-password" placeholder="••••••"
          {...register('senha')} erro={errors.senha?.message} />

        <div className="-mt-2 mb-6 text-right">
          <Link to="/esqueci-senha" className="text-xs text-pink-500 hover:text-pink-700 hover:underline">
            Esqueci a senha
          </Link>
        </div>

        <BotaoPrimario type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </BotaoPrimario>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-gray-300">
        <span className="h-px flex-1 bg-gray-100" /> ou <span className="h-px flex-1 bg-gray-100" />
      </div>

      <BotaoSecundario type="button" onClick={() => navigate('/cadastro')}>
        Criar usuário
      </BotaoSecundario>
    </AuthLayout>
  );
};

export default Login;
