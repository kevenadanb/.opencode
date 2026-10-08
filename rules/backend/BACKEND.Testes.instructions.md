# Testes de Backend — Supabase database-first

Define **como** o backend deste workspace é testado. Complementa `GENERAL.react-vitest-test-enforcer` (que cobre o frontend) e é obrigatória para os agentes de Backend e de Testes.

## Camadas e ferramenta de cada uma

| Camada | O que é | Ferramenta | Onde ficam os testes | Comando |
|---|---|---|---|---|
| Banco | functions, triggers, views, constraints, policies RLS | **pgTAP** (extensão já disponível no Supabase) | `supabase/tests/database/*.test.sql` | `supabase test db` |
| Edge Functions | funções Deno em `supabase/functions/<nome>/` | **Deno test** | `supabase/functions/<nome>/index.test.ts` | `deno test --allow-all supabase/functions/<nome>/` |
| Services (client) | `src/services/[entidade]Service.ts` que chamam `supabase.from()`/`.rpc()` | **Vitest + MSW** (mock da API REST/RPC do Supabase) | `src/services/[entidade]Service.test.ts` | `npm run test -- --run` |
| Integração service ↔ banco | service real contra Supabase local | **Vitest** com `supabase start` e `.env.test` | `src/services/__integration__/*.test.ts` | `npm run test:integration` |

Se o projeto não tiver um dos scripts acima, o Agente de Backend cria o script no `package.json` e registra isso na evidência.

## Ambiente

- Testes rodam contra o **Supabase local** (`supabase start`), nunca contra produção ou homologação.
- `supabase db reset` antes da suíte de integração garante schema + seed limpos. Seeds de teste ficam em `supabase/seed.sql` ou `supabase/tests/fixtures/*.sql`.
- Dados de fixture são fictícios. CPF, e-mail e nome seguem `GENERAL.ReactSegurancaLogsLGPD` (nunca copiar dados reais).

## pgTAP — o que é obrigatório testar

Para cada objeto novo ou alterado:

- **Function**: caso feliz, entrada inválida (deve lançar exceção com `ERRCODE` esperado ou retornar `sucesso = false`), efeito colateral (linha inserida/atualizada), idempotência quando aplicável.
- **Trigger**: dispara na operação certa, não dispara nas outras, efeito (ex.: linha em `hist_*`, `data_atualizacao` preenchida).
- **View**: `SELECT` funciona (`lives_ok`), colunas esperadas (`has_column`), resultado para um fixture conhecido (`results_eq`).
- **Policy RLS**: com `set local role authenticated` + `request.jwt.claims` de um usuário **autorizado** vê/altera o que deve; com usuário **não autorizado** recebe zero linhas ou erro. Sempre os dois lados.
- **Constraint**: `throws_ok` para violação de `chk_`, `unq_`, `fk_id_`.

Estrutura mínima de um arquivo:

```sql
begin;
select plan(4);

-- fixtures
insert into alunos (id, nome, aluno_ativo) values (1, 'Aluno Teste', true);

-- function
select is(
  (select sucesso from fn_matricular_aluno(1, 10)),
  true,
  'fn_matricular_aluno: matricula aluno ativo em curso existente'
);
select throws_ok(
  $$ select fn_matricular_aluno(999, 10) $$,
  'P0002',
  'fn_matricular_aluno: aluno inexistente lança no_data_found'
);

-- RLS
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"uuid-do-aluno-1"}', true);
select results_eq(
  $$ select id from alunos $$,
  $$ values (1) $$,
  'rls alunos: aluno vê apenas o próprio registro'
);
select set_config('request.jwt.claims', '{"sub":"uuid-de-outro"}', true);
select is_empty($$ select id from alunos where id = 1 $$, 'rls alunos: outro usuário não vê o registro');

select * from finish();
rollback;
```

Nome do arquivo: `supabase/tests/database/<objeto>.test.sql` (ex.: `fn_matricular_aluno.test.sql`, `rls_alunos.test.sql`).

## Deno test — Edge Functions

- Separar a lógica em `handler.ts` (função pura que recebe `Request` e dependências) e `index.ts` (só `Deno.serve`). Testar `handler.ts`.
- Cobrir: método/rota inválida (405/404), corpo inválido (400), sem autorização (401), caso feliz (200 com shape esperado), falha do Supabase (500 sem vazar detalhe).
- Cliente Supabase injetado por parâmetro para permitir stub; nunca chamar rede real no teste.

## Vitest + MSW — services

- Um handler MSW por endpoint consumido: `rest.post('*/rest/v1/rpc/fn_nome')`, `rest.get('*/rest/v1/tabela')`.
- Cobrir: sucesso com shape tipado (`IEntidade`), erro Supabase (`{ error: { code, message } }`) tratado e propagado como erro amigável, parâmetros enviados corretamente (assert no corpo da requisição), lista vazia.
- O service não faz cálculo de negócio; se um teste precisar validar cálculo, o cálculo está no lugar errado (`supabase-metodologia`).

## Critérios de aceitação → testes

O Agente de Testes mantém em `04-testes-integracao.md` uma tabela `Critério (Dado/Quando/Então) → arquivo de teste → nome do teste`. Todo critério da spec precisa de ao menos um teste; critérios sem teste bloqueiam a checklist de qualidade.

## O que NÃO fazer

- Testar policies RLS apenas como `postgres`/`service_role` (bypassa RLS e não prova nada).
- Mockar o cliente Supabase com `vi.fn()` solto em vez de MSW — o teste passa sem exercitar a serialização real.
- Usar `.skip` para "estabilizar" a suíte; um teste instável é um bug a corrigir ou remover com justificativa na evidência.
- Rodar `supabase db push` ou `apply_migration` em projeto remoto durante testes.
