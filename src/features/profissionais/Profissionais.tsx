import React, { useState } from 'react';
import { useProfissionais, useDeleteProfissional } from '../../api/hooks';
import { mensagemDeErro, useAuth } from '../../auth/AuthContext';
import Table, { Column } from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import ProfissionalForm from './ProfissionalForm';
import { Profissional } from '../../types';

const iniciais = (nome: string) =>
  nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');

const Profissionais: React.FC = () => {
  const { admin } = useAuth();
  const { data: profissionais, isLoading, isError } = useProfissionais();
  const deleteMutation = useDeleteProfissional();
  const [editando, setEditando] = useState<Profissional | null>(null);
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleDelete = (profissional: Profissional) => {
    if (!window.confirm(`Excluir ${profissional.nome} da equipe?`)) return;
    setErro(null);
    deleteMutation.mutate(profissional.id, { onError: (e) => setErro(mensagemDeErro(e, 'Não foi possível excluir.')) });
  };

  const columns: Column<Profissional>[] = [
    {
      key: 'nome',
      header: 'Profissional',
      render: (nome: string) => (
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-medium text-pink-600">
            {iniciais(nome)}
          </span>
          <span className="font-medium text-gray-800">{nome}</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Profissionais"
        subtitle="Nossa equipe"
        action={admin && <Button onClick={() => setCriando(true)} className="w-full sm:w-auto">Novo profissional</Button>}
      />
      {erro && <Alert>{erro}</Alert>}
      {isError && <Alert>Não foi possível carregar os profissionais.</Alert>}
      {/* Criar, editar e excluir: só administradores (a API também valida) */}
      <Table
        data={profissionais || []}
        columns={columns}
        onEdit={admin ? setEditando : undefined}
        onDelete={admin ? handleDelete : undefined}
        loading={isLoading}
        emptyMessage="Nenhum profissional cadastrado."
      />
      <Modal isOpen={criando} onClose={() => setCriando(false)} title="Novo profissional">
        <ProfissionalForm onClose={() => setCriando(false)} />
      </Modal>
      {editando && (
        <Modal isOpen onClose={() => setEditando(null)} title="Editar profissional">
          <ProfissionalForm profissional={editando} onClose={() => setEditando(null)} />
        </Modal>
      )}
    </div>
  );
};

export default Profissionais;
