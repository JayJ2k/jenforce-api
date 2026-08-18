# Jenforce API

API REST do **Jenforce**, uma central de chamados para suporte técnico e atendimento interno.

O projeto foi desenvolvido com foco em simular uma aplicação real de help desk/service desk, permitindo abertura de chamados, acompanhamento de status, definição de prioridade e registro de histórico por comentários.

## Sobre o projeto

O **Jenforce** é uma plataforma para organizar solicitações de suporte, priorizar atendimentos e acompanhar o histórico de cada chamado.

A API permite que usuários criem chamados, acompanhem suas solicitações e adicionem comentários ao histórico. Usuários com perfil de atendimento ou administração podem visualizar e gerenciar chamados de forma mais ampla.

## Padrão de contribuição

Este projeto segue um fluxo obrigatório baseado em Issues, branches e Pull Requests.

Antes de qualquer alteração chegar à branch `main`, é necessário:

- Criar uma Issue no GitHub
- Criar uma branch específica para a tarefa
- Abrir um Pull Request mencionando a Issue relacionada
- Executar validações de build, qualidade, segurança e arquitetura

As regras completas estão documentadas no arquivo [`AGENTS.md`](./AGENTS.md).

## Funcionalidades

- Cadastro de usuários
- Login com autenticação JWT
- Rota protegida para perfil autenticado
- Abertura de chamados
- Listagem de chamados
- Detalhamento de chamado
- Atualização de status
- Atualização de prioridade
- Comentários no histórico do chamado
- Controle de acesso por perfil de usuário

## Perfis de usuário

- `CUSTOMER` — usuário solicitante
- `AGENT` — agente de suporte
- `ADMIN` — administrador

## Status dos chamados

- `OPEN` — Aberto
- `IN_PROGRESS` — Em atendimento
- `RESOLVED` — Resolvido
- `CLOSED` — Encerrado

## Prioridades

- `LOW` — Baixa
- `MEDIUM` — Média
- `HIGH` — Alta
- `URGENT` — Urgente

## Categorias

- `ACCESS` — Acesso
- `SYSTEM` — Sistema
- `HARDWARE` — Hardware
- `NETWORK` — Rede
- `REQUEST` — Solicitação
- `BUG` — Erro/Bug

## Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- JWT
- bcryptjs
- dotenv
- CORS
- Biome
- Vitest
- Supertest
- Stryker

## Estrutura principal

```txt
jenforce-api/
+-- .github/
¦   +-- workflows/
¦       +-- ci.yml
+-- prisma/
¦   +-- schema.prisma
+-- src/
¦   +-- app.ts
¦   +-- config/
¦   ¦   +-- prisma.ts
¦   +-- controllers/
¦   ¦   +-- auth.controller.ts
¦   ¦   +-- ticket.controller.ts
¦   ¦   +-- comment.controller.ts
¦   +-- middlewares/
¦   ¦   +-- auth.middleware.ts
¦   +-- routes/
¦   ¦   +-- auth.routes.ts
¦   ¦   +-- ticket.routes.ts
¦   ¦   +-- comment.routes.ts
¦   +-- server.ts
+-- tests/
¦   +-- auth.test.ts
+-- .env.example
+-- package.json
+-- tsconfig.json
```

## Variáveis de ambiente

Crie um arquivo `.env` local com base no `.env.example`.

```env
PORT=3334
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
```

O arquivo `.env` não deve ser versionado.

## Como rodar o projeto

Instale as dependências:

```bash
npm install
```

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```txt
http://localhost:3334
```

## Rotas principais

### Autenticação

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Chamados

```txt
POST   /tickets
GET    /tickets
GET    /tickets/:id
PUT    /tickets/:id
DELETE /tickets/:id
```

### Comentários

```txt
POST /tickets/:ticketId/comments
GET  /tickets/:ticketId/comments
```

## Qualidade de código

O Jenforce utiliza o **Biome** para padronização de código, formatação, lint e organização de imports.

Antes de abrir um Pull Request, execute:

```bash
npm run build
npm run check
npm test
```

Para aplicar correções automáticas de formatação e organização de imports, execute:

```bash
npx biome check --write .
```

Scripts disponíveis:

```bash
npm run dev
npm run build
npm run start
npm run format
npm run lint
npm run check
npm test
npm run test:mutation
```

## Segurança

Alguns cuidados obrigatórios do projeto:

- Não versionar `.env`
- Não expor `JWT_SECRET`
- Não retornar senha nas respostas da API
- Não registrar tokens ou senhas em logs
- Cadastro público deve criar apenas usuários `CUSTOMER`
- Perfis `AGENT` e `ADMIN` devem ser gerenciados por fluxo interno
- Validar entradas recebidas nas rotas
- Proteger rotas sensíveis com autenticação

## Testes

Execute os testes automatizados com:

```bash
npm test
```

Execute os testes de mutação com:

```bash
npm run test:mutation
```

## CI

O projeto possui workflow de CI no GitHub Actions.

A cada Pull Request para a `main`, o CI executa:

- Instalação de dependências
- Geração do Prisma Client
- Execução das migrations
- Build
- Biome check
- Testes automatizados