import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAgendamentos, useProfissionais, useServicos } from '../../api/hooks';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/PageHeader';
import { formatDia, formatHora, mesmoDia } from '../../utils/dateHelpers';
import { formatarNome } from '../../utils/textHelpers';

const Card: React.FC<{ titulo: string; valor: React.ReactNode; detalhe?: string }> = ({ titulo, valor, detalhe }) => (
  <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50">
    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{titulo}</p>
    <p className="mt-2 text-3xl font-light text-pink-600">{valor}</p>
    {detalhe && <p className="mt-1 text-xs text-gray-400">{detalhe}</p>}
  </div>
);

const atalhos = [
  { to: '/agendamentos', titulo: 'Agendamentos', texto: 'Marque, altere ou cancele horários' },
  { to: '/servicos', titulo: 'Serviços', texto: 'Veja preços e duração' },
  { to: '/profissionais', titulo: 'Profissionais', texto: 'Conheça a equipe' },
];

const Dashboard: React.FC = () => {
  const { sessao } = useAuth();
  const { data: agendamentos, isLoading, isError } = useAgendamentos();
  const { data: servicos } = useServicos();
  const { data: profissionais } = useProfissionais();

  const { hoje, proximos } = useMemo(() => {
    const agora = new Date();
    const lista = agendamentos ?? [];
    return {
      hoje: lista.filter((a) => mesmoDia(new Date(a.data), agora)).length,
      // cópia antes de ordenar: não altera os dados guardados no cache
      proximos: [...lista]
        .filter((a) => new Date(a.data) >= agora)
        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()),
    };
  }, [agendamentos]);

  const carregando = (v: number) => (isLoading ? '–' : v);
  const primeiroNome = formatarNome(sessao?.nome).split(' ')[0];

  return (
    <div>
      <PageHeader title={`Olá, ${primeiroNome}`} subtitle="Um resumo dos seus agendamentos" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card titulo="Hoje" valor={carregando(hoje)} detalhe="agendamentos" />
        <Card titulo="Próximos" valor={carregando(proximos.length)} detalhe="a partir de agora" />
        <Card titulo="Serviços" valor={servicos?.length ?? '–'} detalhe="disponíveis" />
        <Card titulo="Profissionais" valor={profissionais?.length ?? '–'} detalhe="na equipe" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm shadow-pink-100/50 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-light tracking-wide text-gray-800">Próximos agendamentos</h2>
            <Link to="/agendamentos" className="text-sm text-pink-500 hover:text-pink-700 hover:underline">Ver todos</Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-pink-100/60" />)}</div>
          ) : isError ? (
            <p className="py-8 text-center text-sm text-rose-500">Não foi possível carregar os agendamentos.</p>
          ) : proximos.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">Nenhum agendamento marcado.</p>
              <Link to="/agendamentos" className="mt-3 inline-block text-sm font-medium text-pink-600 hover:underline">
                Marcar um horário
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-pink-50">
              {proximos.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center gap-4 py-3">
                  <div className="w-16 shrink-0 rounded-xl bg-pink-50 py-2 text-center">
                    <p className="text-sm font-medium text-pink-600">{formatHora(a.data)}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800">{a.servico}</p>
                    <p className="truncate text-sm text-gray-500">com {a.profissional} · {a.cliente}</p>
                  </div>
                  <p className="hidden shrink-0 text-sm capitalize text-gray-400 sm:block">{formatDia(a.data)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-light tracking-wide text-gray-800 lg:mb-4">Atalhos</h2>
          {atalhos.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="group flex items-center justify-between rounded-2xl border border-pink-100 bg-white p-4 shadow-sm shadow-pink-100/50 transition hover:border-pink-300"
            >
              <div>
                <p className="font-medium text-gray-800">{a.titulo}</p>
                <p className="text-sm text-gray-500">{a.texto}</p>
              </div>
              <span aria-hidden="true" className="text-pink-300 transition group-hover:translate-x-1 group-hover:text-pink-500">→</span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
