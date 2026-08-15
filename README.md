# Jenforce API

API REST do **Jenforce**, uma central de chamados para suporte técnico e atendimento interno.

O projeto foi desenvolvido com foco em simular uma aplicação real de help desk/service desk, permitindo abertura de chamados, acompanhamento de status, definição de prioridade e registro de histórico por comentários.

## Sobre o projeto

O **Jenforce** é uma plataforma para organizar solicitações de suporte, priorizar atendimentos e acompanhar o histórico de cada chamado.

A API permite que usuários criem chamados, acompanhem suas solicitações e adicionem comentários ao histórico. Usuários com perfil de atendimento ou administração podem visualizar e gerenciar chamados de forma mais ampla.

## ## Padrão de contribuição

Este projeto segue um fluxo obrigatório baseado em Issues, branches e Pull Requests.

Antes de qualquer alteração chegar à branch `main`, é necessário:

- Criar uma Issue no GitHub
- Criar uma branch específica para a tarefa
- Abrir um Pull Request mencionando a Issue relacionada
- Executar validações de build, qualidade, segurança e arquitetura

As regras completas estão documentadas no arquivo `AGENTS.md`](./[AGENTS.md](http://AGENTS.md)).  

**Funcionalidades**

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

## Estrutura principal

```txt

jenforce-api/

├── prisma/

│   └── schema.prisma

├── src/

│   ├── config/

│   │   └── prisma.ts

│   ├── controllers/

│   │   ├── auth.controller.ts

│   │   ├── ticket.controller.ts

│   │   └── comment.controller.ts

│   ├── middlewares/

│   │   └── auth.middleware.ts

│   ├── routes/

│   │   ├── auth.routes.ts

│   │   ├── ticket.routes.ts

│   │   └── comment.routes.ts

│   └── server.ts

├── .env.example

├── package.json

└── tsconfig.json
```

