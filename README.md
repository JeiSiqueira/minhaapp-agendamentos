# MinhaApp Agendamentos

Sistema web de agendamento para salão de beleza desenvolvido com foco em
boas práticas de frontend, integração com API REST e aplicação de regras
reais de negócio.

O sistema permite que usuários realizem login, visualizem serviços,
escolham profissionais e agendem horários de forma simples e segura.

------------------------------------------------------------------------

##  Tecnologias Utilizadas

###  Frontend

-   React
-   TypeScript
-   Vite
-   ESLint
-   CSS customizado

### 🔹 Conceitos Aplicados

-   Componentização
-   Hooks (`useState`, `useEffect`)
-   Consumo de API REST com `fetch`
-   Manipulação de datas e horários (UTC → GMT-3)
-   Persistência de sessão com `localStorage`
-   Validação de formulários
-   Controle de estado via props

------------------------------------------------------------------------

##  Arquitetura do Projeto

    src/
     ├── App.tsx
     ├── main.tsx
     └── components/
          ├── Login
          ├── Servicos
          ├── FormAgendamento
          ├── ListaAgendamentos
          ├── Header
          └── Footer

A aplicação é baseada em arquitetura componentizada, separando
responsabilidades entre visualização, lógica e integração com API.

------------------------------------------------------------------------

## Componentes Principais

### Login

-   Autenticação simples do usuário
-   Persistência de sessão via `localStorage`
-   Controle de estado de usuário logado

### Servicos

-   Lista serviços vindos da API
-   Exibe nome, duração e preço
-   Permite seleção de serviço
-   Scroll automático até o formulário de agendamento

### FormAgendamento

Responsável por: - Captura de dados do cliente - Seleção de serviço e
profissional - Escolha de data e horário - Validação de dados - Envio
para API - Exibição de modal de sucesso - Controle de loading

Validações implementadas: - Nome obrigatório (máx. 150 caracteres) -
E-mail válido (regex) - Telefone mínimo de 10 dígitos - Serviço
obrigatório - Profissional obrigatório - Data obrigatória - Não permite
datas passadas - Para o dia atual, horário deve ser pelo menos 1 hora à
frente

###  ListaAgendamentos

-   Busca todos os agendamentos da API
-   Filtra apenas os do usuário logado
-   Conversão automática de UTC para GMT-3
-   Exibe serviço, data formatada, cliente e profissional

###  Header e Footer

-   Controle de sessão
-   Logout
-   Informações institucionais

------------------------------------------------------------------------

##  Integração com API

### Serviços

GET /servicos

### Profissionais

GET /profissionais

### Agendamentos

GET /agendamentos\
POST /agendamentos

### Exemplo de Payload Enviado

``` json
{
  "usuarioId": "1",
  "servicoId": 2,
  "profissionalId": 3,
  "data": "2026-02-20T15:00:00.000Z"
}
```

------------------------------------------------------------------------

##  Regras de Negócio Implementadas

Validação completa de formulário\
Controle de sessão do usuário\
Exibição apenas dos agendamentos do usuário logado\
Conversão de fuso horário\
Bloqueio de datas passadas\
Restrição de horário mínimo para o mesmo dia

------------------------------------------------------------------------

##  Como Rodar o Projeto

###  Clonar o repositório

    git clone https://github.com/seuusuario/minhaapp-agendamentos.git

###  Instalar dependências

    npm install

###  Rodar ambiente de desenvolvimento

    npm run dev

###  Gerar build de produção

    npm run build

------------------------------------------------------------------------

##  Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

-   Praticar integração frontend + backend
-   Aplicar regras reais de negócio
-   Simular sistema comercial de agendamento
-   Fortalecer portfólio para vagas de estágio/júnior

------------------------------------------------------------------------

##  Melhorias Futuras

-   Autenticação com JWT
-   Controle de disponibilidade por profissional
-   Cancelamento de agendamento
-   Painel administrativo
-   Paginação
-   Filtro por data
-   Integração com gateway de pagamento
-   Testes automatizados

------------------------------------------------------------------------

##  Autor

Jei Siqueira\
Desenvolvedor Full Stack em formação\
Foco em React, TypeScript e APIs REST
