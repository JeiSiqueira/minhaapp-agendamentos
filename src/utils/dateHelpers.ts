// A API trabalha em UTC: as datas chegam com "Z" (ex.: "2026-11-26T20:00:00Z")
// e o navegador converte para o horário local na hora de exibir.

export const formatDate = (date: string) =>
  new Date(date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export const formatDia = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });

export const formatHora = (date: string) =>
  new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Data da API (UTC) -> valor do <input type="datetime-local"> no horário local. Ex.: "...T20:00:00Z" -> "2026-11-26T17:00" */
export const paraInputLocal = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}T${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
};

/** Valor do input (horário local) -> API (UTC, com "Z"). Ex.: "2026-11-26T17:00" -> "2026-11-26T20:00:00.000Z" */
export const doInputParaApi = (local: string) => new Date(local).toISOString();

export const mesmoDia = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
