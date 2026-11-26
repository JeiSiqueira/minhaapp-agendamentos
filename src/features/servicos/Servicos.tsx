import React, { useState } from 'react';
import { useServicos, useDeleteServico } from '../../api/hooks';
import { mensagemDeErro, useAuth } from '../../auth/AuthContext';
import Table, { Column } from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import ServicoForm from './ServicoForm';
import { Servico } from '../../types';
import { formatPreco } from '../../utils/dateHelpers';

const Servicos: React.FC = () => {
  const { admin } = useAuth();
  const { data: servicos, isLoading, isError } = useServicos();
  const deleteMutation = useDeleteServico();
  const [editando, setEditando] = useState<Servico | null>(null);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleDelete = (servico: Servico) => {
    if (!window.confirm(`Excluir o serviço "${servico.nome}"?`)) return;
    setErro(null);
    deleteMutation.mutate(servico.id, { onError: (e) => setErro(mensagemDeErro(e, 'Não foi possível excluir.')) });
  };

  const columns: Column<Servico>[] = [
    { key: 'nome', header: 'Serviço' },
    { key: 'preco', header: 'Preço', render: (v: number) => formatPreco(v) },
    { key: 'duracaoMinutos', header: 'Duração', render: (v: number) => `${v} min` },
  ];

  return (
    <div>
      <PageHeader
        title="Serviços"
        subtitle="Tudo o que você pode agendar"
        action={admin && <Button onClick={() => setCriando(true)} className="w-full sm:w-auto">Novo serviço</Button>}
      />
      {erro && <Alert>{erro}</Alert>}
      {isError && <Alert>Não foi possível carregar os serviços.</Alert>}
      {/* Criar, editar e excluir: só administradores (a API também valida) */}
      <Table
        data={servicos || []}
        columns={columns}
        onEdit={admin ? setEditando : undefined}
        onDelete={admin ? handleDelete : undefined}
        loading={isLoading}
        emptyMessage="Nenhum serviço cadastrado."
      />
      <Modal isOpen={criando} onClose={() => setCriando(false)} title="Novo serviço">
        <ServicoForm onClose={() => setCriando(false)} />
      </Modal>
      {editando && (
        <Modal isOpen onClose={() => setEditando(null)} title="Editar serviço">
          <ServicoForm servico={editando} onClose={() => setEditando(null)} />
        </Modal>
      )}
    </div>
  );
};

export default Servicos;
