---
description: Procedimento seguro para validar e aplicar migrations do Supabase local em banco remoto.
---

# Migrations do Supabase: local → remoto

## Objetivo

Garantir que qualquer alteração de schema, trigger, policy, function ou dado no Supabase seja validada localmente antes de ser aplicada no banco remoto, com revisão explícita do SQL e confirmação do projeto correto.

## Regra principal

Nunca aplicar uma migration local diretamente em um banco remoto sem validar primeiro no ambiente local e confirmar o projeto alvo.

## Fluxo obrigatório

### 1) Validar localmente antes de qualquer push

Rodar a migration no ambiente local antes de tocar em produção ou homologação.

```bash
supabase start
supabase db reset
supabase migration up
```

Ou, quando o projeto usa reset completo:

```bash
supabase db reset --local
```

Verificar:
- schema foi criado sem erro
- triggers, policies e functions rodam corretamente
- constraints e índices não quebram o banco
- qualquer dado inicial necessário foi inserido corretamente

### 2) Revisar o SQL da migration

Antes de aplicar de fato no remoto:
- abrir o arquivo em `supabase/migrations/`
- revisar colunas alteradas, drops, updates em massa e mudanças de policy
- confirmar se a operação é segura para produção
- se houver migração destrutiva, preferir estratégia de `expandir e depois remover`

> Se a migration afetar dados sensíveis ou regras críticas, a alteração deve ser explicitamente revisada antes do push.

### 3) Confirmar o projeto remoto correto

Antes de enviar para o banco remoto, confirmar que o CLI está vinculado ao projeto certo.

```bash
supabase link --project-ref <project-ref>
```

Se houver mais de um projeto, nunca assumir o alvo. Validar o `project-ref` e o banco correto antes de continuar.

### 4) Aplicar somente após confirmação

Quando a migration já foi validada localmente e o projeto alvo conferido, aplicar:

```bash
supabase db push
```

Esse comando envia as migrations pendentes para o banco remoto vinculado.

### 5) Verificar o resultado no banco remoto

Depois do push:
- confirmar que a migration entrou na lista de migrations
- validar a tabela/coluna/function/trigger criada
- testar o fluxo principal impactado
- conferir se a aplicação continua funcionando com o schema novo

## Comandos úteis

### Ver diff antes do push

```bash
supabase db diff --linked
```

### Verificar status do projeto vinculado

```bash
supabase status
```

### Rodar localmente com CLI via npx

```bash
npx supabase start
npx supabase db reset
npx supabase link --project-ref <project-ref>
npx supabase db push
```

## Regras de segurança

- nunca aplicar migration remota sem validar localmente
- nunca usar `db push` em banco errado
- nunca aplicar migration destrutiva sem revisão explícita
- nunca rodar push de produção a partir de branch ou ambiente sem confirmação
- quando houver risco alto, preferir homologação antes de produção
- manter backup/rollback para alterações de dados críticas

## Checklist de execução

- [ ] migration validada localmente
- [ ] SQL revisado e entendido
- [ ] projeto remoto correto
- [ ] comando de push confirmado
- [ ] resultado verificado no remote

## Exemplo de fluxo seguro

```bash
# 1. validar localmente
supabase start
supabase db reset
supabase migration up

# 2. confirmar projeto remoto
supabase link --project-ref eqvzvaxohbtlakorutia

# 3. aplicar no remoto
supabase db push

# 4. verificar no banco
supabase status
```

## Observação importante

Para projetos com Supabase, o push em produção/homologação nunca deve ser tratado como operação automática. A regra correta é: local ok, SQL revisado, projeto alvo confirmado e validação pós-aplicação obrigatória.
