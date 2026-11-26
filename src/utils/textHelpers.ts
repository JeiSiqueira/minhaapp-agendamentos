// Partículas que ficam em minúsculo no meio de nomes ("Maria da Silva")
const PARTICULAS = new Set(['da', 'das', 'de', 'do', 'dos', 'e']);

/**
 * Deixa a primeira letra de cada palavra do nome em maiúscula.
 * Ex.: "jeimili siqueira" -> "Jeimili Siqueira"; "maria da silva" -> "Maria da Silva".
 * O resto da palavra é mantido como está (não estraga nomes como "McDonald").
 */
export function formatarNome(nome: string | undefined | null): string {
  if (!nome) return '';
  return nome
    .trim()
    .split(/\s+/)
    .map((palavra, i) =>
      i > 0 && PARTICULAS.has(palavra.toLowerCase())
        ? palavra.toLowerCase()
        : palavra.charAt(0).toLocaleUpperCase('pt-BR') + palavra.slice(1)
    )
    .join(' ');
}
