# Jenforce API — Guia de contribuição

Este projeto segue um fluxo obrigatório baseado em **Issue → branch → alteração → validações → Pull Request → merge**.

Nenhuma alteração deve ser feita diretamente na branch `main`.

## Fluxo obrigatório

1. Criar uma Issue no GitHub descrevendo a tarefa.
2. Criar uma branch a partir da `main`.
3. Implementar a alteração.
4. Executar validações locais.
5. Abrir um Pull Request mencionando a Issue.
6. Aguardar o CI passar.
7. Fazer merge.
8. Atualizar a `main` local e apagar a branch.

## Padrão de branches

Use nomes claros e vinculados à Issue:

```txt
feature/issue-X-descricao
fix/issue-X-descricao
security/issue-X-descricao
test/issue-X-descricao
docs/issue-X-descricao
chore/issue-X-descricao
ci/issue-X-descricao
refactor/issue-X-descricao
```

## Padrão de commits

Use commits objetivos:

```txt
feat: adiciona nova funcionalidade
fix: corrige comportamento
security: ajusta regra de segurança
test: adiciona ou corrige testes
docs: atualiza documentação
chore: ajusta configuração ou manutenção
ci: ajusta integração contínua
refactor: melhora estrutura sem alterar comportamento
```

## Validações obrigatórias

Antes de abrir Pull Request, execute:

```bash
npm run build
npm run check
npm test
```

Quando necessário, execute também:

```bash
npm run test:mutation
```

Para aplicar correções automáticas de formatação:

```bash
npx biome check --write .
```

## Segurança

Regras obrigatórias:

- Nunca versionar `.env`
- Nunca expor `JWT_SECRET`, tokens ou senhas
- Nunca retornar `password` nas respostas da API
- Nunca registrar tokens ou senhas em logs
- Cadastro público deve criar apenas usuários `CUSTOMER`
- Perfis `AGENT` e `ADMIN` devem ser gerenciados por fluxo interno
- Validar entradas recebidas nas rotas
- Proteger rotas sensíveis com autenticação
- Manter `.env.example` atualizado sem dados reais

## Prisma

Cuidados com banco de dados:

- Alterações no schema devem gerar migration
- Nunca apagar migrations sem motivo claro
- Usar `npx prisma migrate dev` em desenvolvimento
- Usar `npx prisma migrate deploy` no CI/produção
- Rodar `npx prisma generate` quando necessário

## Pull Request

Todo PR deve conter:

- Resumo da alteração
- Issue relacionada com `Closes #X`
- Validações executadas
- Observações de segurança quando aplicável