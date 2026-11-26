import React from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function cell<T>(col: Column<T>, item: T) {
  return col.render ? col.render(item[col.key], item) : (item[col.key] as React.ReactNode);
}

function Acoes<T>({ item, onEdit, onDelete }: { item: T; onEdit?: (i: T) => void; onDelete?: (i: T) => void }) {
  return (
    <div className="flex gap-4 text-sm font-medium">
      {onEdit && <button onClick={() => onEdit(item)} className="text-pink-600 hover:text-pink-800 hover:underline">Editar</button>}
      {onDelete && <button onClick={() => onDelete(item)} className="text-gray-400 hover:text-rose-600 hover:underline">Excluir</button>}
    </div>
  );
}

// Em telas grandes mostra uma tabela; no celular, um cartão por item.
function Table<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  loading,
  emptyMessage = 'Nada por aqui ainda.',
}: TableProps<T>) {
  const temAcoes = !!(onEdit || onDelete);

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Carregando">
        {[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-pink-100/60" />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-pink-200 bg-white px-6 py-12 text-center text-sm text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Celular */}
      <ul className="space-y-3 md:hidden">
        {data.map((item) => (
          <li key={item.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm shadow-pink-100/50">
            <dl className="space-y-2">
              {columns.map((col, i) =>
                i === 0 ? (
                  <div key={col.key as string}>
                    <dt className="sr-only">{col.header}</dt>
                    <dd className="font-medium text-gray-800">{cell(col, item)}</dd>
                  </div>
                ) : (
                  <div key={col.key as string} className="flex justify-between gap-4 text-sm">
                    <dt className="text-gray-400">{col.header}</dt>
                    <dd className="text-right text-gray-700">{cell(col, item)}</dd>
                  </div>
                )
              )}
            </dl>
            {temAcoes && (
              <div className="mt-4 border-t border-pink-50 pt-3">
                <Acoes item={item} onEdit={onEdit} onDelete={onDelete} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Tablet / desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm shadow-pink-100/50 md:block">
        <table className="min-w-full">
          <thead className="bg-pink-50/60">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {col.header}
                </th>
              ))}
              {temAcoes && <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {data.map((item) => (
              <tr key={item.id} className="transition hover:bg-pink-50/40">
                {columns.map((col) => (
                  <td key={col.key as string} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {cell(col, item)}
                  </td>
                ))}
                {temAcoes && (
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-end"><Acoes item={item} onEdit={onEdit} onDelete={onDelete} /></div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
