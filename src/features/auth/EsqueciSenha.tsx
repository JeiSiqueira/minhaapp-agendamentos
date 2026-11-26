import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { mensagemDeErro } from '../../auth/AuthContext';
import { AuthLayout, Aviso, BotaoPrimario, BotaoSecundario, Campo } from './AuthLayout';

// Passo 1: e-mail -> a API envia um código de 6 dígitos.
// Passo 2: código + nova senha.

const emailSchema = z.object({ email: z.string().email('Informe um e-mail válido') });

const senhaSchema = z
  .object({
    codigo: z.string().trim().regex(/^\d{6}$/, 'O código tem 6 números'),
    novaSenha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmar: z.string(),
  })
  .refine((d) => d.novaSenha === d.confirmar, { message: 'As senhas não são iguais', path: ['confirmar'] });

const EsqueciSenha: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const formEmail = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });
  const formSenha = useForm<z.infer<typeof senhaSchema>>({ resolver: zodResolver(senhaSchema) });

  const pedirCodigo = async (alvo: string) => {
    setErro(null);
    try {
      const { data } = await api.post<{ message: string }>('/api/usuarios/esqueci-senha', { email: alvo });
      setEmail(alvo);
      setAviso(data.message);
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };

  const redefinir = async (d: z.infer<typeof senhaSchema>) => {
    if (!email) return;
    setErro(null);
    try {
      await api.post('/api/usuarios/redefinir-senha', { email, codigo: d.codigo.trim(), novaSenha: d.novaSenha });
      navigate('/login', { replace: true, state: { email, mensagem: 'Senha alterada! Entre com a nova senha.' } });
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  };

  return (
    <AuthLayout
      titulo="Redefinir senha"
      subtitulo={email ? `Digite o código enviado para ${email}` : 'Vamos enviar um código para o seu e-mail'}
    >
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {aviso && !erro && <Aviso tipo="sucesso">{aviso}</Aviso>}

      {!email ? (
        <form onSubmit={formEmail.handleSubmit((d) => pedirCodigo(d.email.trim()))} noValidate>
          <Campo label="E-mail" type="email" autoComplete="email" placeholder="voce@email.com"
            {...formEmail.register('email')} erro={formEmail.formState.errors.email?.message} />
          <BotaoPrimario type="submit" disabled={formEmail.formState.isSubmitting}>
            {formEmail.formState.isSubmitting ? 'Enviando…' : 'Enviar código'}
          </BotaoPrimario>
        </form>
      ) : (
        <form onSubmit={formSenha.handleSubmit(redefinir)} noValidate>
          <Campo label="Código" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000"
            className="tracking-[0.5em]" {...formSenha.register('codigo')} erro={formSenha.formState.errors.codigo?.message} />
          <Campo label="Nova senha" type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres"
            {...formSenha.register('novaSenha')} erro={formSenha.formState.errors.novaSenha?.message} />
          <Campo label="Confirmar nova senha" type="password" autoComplete="new-password" placeholder="Repita a senha"
            {...formSenha.register('confirmar')} erro={formSenha.formState.errors.confirmar?.message} />
          <BotaoPrimario type="submit" disabled={formSenha.formState.isSubmitting}>
            {formSenha.formState.isSubmitting ? 'Salvando…' : 'Salvar nova senha'}
          </BotaoPrimario>
          <BotaoSecundario type="button" className="mt-3" onClick={() => pedirCodigo(email)}>
            Reenviar código
          </BotaoSecundario>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="text-pink-500 hover:text-pink-700 hover:underline">Voltar para o login</Link>
      </p>
    </AuthLayout>
  );
};

export default EsqueciSenha;
