import React, { useState } from 'react';
import { useAgendamentos, useDeleteAgendamento } from '../../api/hooks';
import { mensagemDeErro } from '../../auth/AuthContext';
import Table, { Column } from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import AgendamentoForm from './AgendamentoForm';
import { Agendamento } from '../../types';
import { formatDate } from '../../utils/dateHelpers';

const Agendamentos: React.FC = () => {
  const { data: agendamentos, isLoading, isError } = useAgendamentos();
  const deleteMutation = useDeleteAgendamento();
  const [editando, setEditando] = useState<Agendamento | null>(null);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleDelete = (agendamento: Agendamento) => {
    if (!window.confirm(`Cancelar o agendamento de ${agendamento.servico} em ${formatDate(agendamento.data)}?`)) return;
    setErro(null);
    deleteMutation.mutate(agendamento.id, { onError: (e) => setErro(mensagemDeErro(e, 'Não foi possível cancelar.')) });
  };

  const ordenados = [...(agendamentos ?? [])].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  const columns: Column<Agendamento>[] = [
    { key: 'servico', header: 'Serviço' },
    { key: 'data', header: 'Data', render: (v: string) => formatDate(v) },
    { key: 'profissional', header: 'Profissional' },
    { key: 'cliente', header: 'Cliente' },
  ];

  return (
    <div>
      <PageHeader
        title="Agendamentos"
        subtitle="Seus horários marcados"
        action={<Button onClick={() => setCriando(true)} className="w-full sm:w-auto">Novo agendamento</Button>}
      />
      {erro && <Alert>{erro}</Alert>}
      {isError && <Alert>Não foi possível carregar os agendamentos.</Alert>}
      <Table
        data={ordenados}
        columns={columns}
        onEdit={setEditando}
        onDelete={handleDelete}
        loading={isLoading}
        emptyMessage="Você ainda não tem agendamentos."
      />
      <Modal isOpen={criando} onClose={() => setCriando(false)} title="Novo agendamento">
        <AgendamentoForm onClose={() => setCriando(false)} />
      </Modal>
      {editando && (
        <Modal isOpen onClose={() => setEditando(null)} title="Editar agendamento">
          <AgendamentoForm agendamento={editando} onClose={() => setEditando(null)} />
        </Modal>
      )}
    </div>
  );
};

export default Agendamentos;
