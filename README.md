# MinhaApp — Agendamentos (Front-end)

Interface web do sistema de agendamento para salão de beleza: o cliente cria a conta, entra e marca horários escolhendo serviço, profissional e data.

Construída em **React + TypeScript**, consumindo a API REST [minhaapi-agendamentos](https://github.com/JeiSiqueira/minhaapi-agendamentos) (.NET 8).

## Funcionalidades

- **Login, cadastro e "esqueci a senha"** (código de 6 dígitos enviado por e-mail)
- **Sessão com JWT:** o token vai em todas as chamadas; se expirar, a pessoa volta para o login
- **Agendamentos:** criar, remarcar e cancelar, com aviso quando o horário já está ocupado
- **Datas no fuso de quem usa:** a API trabalha em UTC e a tela converte para o horário local
- **Perfis:** clientes veem só os próprios agendamentos; administradores também mantêm serviços e profissionais
- **Layout responsivo:** tabelas viram cartões no celular

## Tecnologias

| Uso | Biblioteca |
| --- | --- |
| Interface | React 18, TypeScript, Vite |
| Estilo | Tailwind CSS |
| Rotas | React Router |
| Dados da API | Axios + TanStack Query (cache e recarga automática) |
| Formulários | React Hook Form + Zod (validação) |
| Testes | Vitest + Testing Library |
| Produção | Docker (Nginx sem root), GitHub Actions |

## Estrutura

```
src/
├── api/          cliente HTTP (token JWT) e hooks de consulta à API
├── auth/         sessão, contexto de login e proteção de rotas
├── components/   botões, campos, tabela, modal e alertas reutilizáveis
├── features/     telas: auth, dashboard, agendamentos, serviços, profissionais
├── types/        tipos dos dados da API
└── utils/        datas (UTC ↔ local), preço e nomes
```

## Como executar

Pré-requisitos: Node.js 20+ e a [API](https://github.com/JeiSiqueira/minhaapi-agendamentos) rodando (com Docker: `docker compose up --build` no repositório da API).

```bash
npm install
cp .env.example .env    # VITE_API_BASE_URL=http://localhost:5138
npm run dev             # http://localhost:5173
```

Outros comandos: `npm run build` (gera `dist/`) e `npm test`.

## Deploy

A cada push na `main`, o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) gera a imagem Docker (com o endereço público da API embutido no build), publica no GitHub Container Registry e atualiza o container na VPS. O HTTPS fica a cargo do proxy reverso (Caddy).

## Autora

**Jeimili Siqueira Mendes**
[GitHub](https://github.com/JeiSiqueira) · [LinkedIn](https://www.linkedin.com/in/jeimili-siqueira)
