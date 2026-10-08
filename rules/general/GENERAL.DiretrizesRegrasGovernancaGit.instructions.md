# Diretrizes e Regras de Governança Git

## 1. Aprovação Explícita (Obrigatório)

Você (IA) tem capacidade de executar comandos de terminal, mas é **estritamente proibido** executar operações que alterem o estado do repositório **sem a aprovação explícita do usuário**. Isso inclui:
- `git commit`
- `git push`
- `git rebase`
- `git merge`
- `git reset`
- `git cherry-pick`
- `git tag`

## 2. Fluxo Obrigatório para Commits

1. **Nunca faça commit por conta própria.** Ao finalizar um bloco de código ou uma fase do plano, pare a execução.
2. **Sugira a mensagem de commit no chat** seguindo o padrão imposto pelo hook `commit-msg` e template `.gitmessage`.
3. **Pergunte sempre de forma clara**: `"Posso realizar o commit dessas alterações?"` e **aguarde a resposta** do usuário antes de executar o `git commit`.
4. **Só execute o `git commit`** após o usuário responder afirmativamente ("sim", "pode", "ok", "aprovado", etc.).
5. **Granularidade**: Separe os commits por feature de forma granular. Cada commit deve agrupar mudanças relacionadas a uma única feature/correção/refatoração coesa, nunca misturando escopos distintos.
6. **Nunca faça `git push`** ou alteração de estado remoto sem aprovação expressa.

## 3. Padrão de Mensagens de Commit (Conventional Commits pt-BR)

Formato obrigatório:
```
tipo(escopo-opcional): resumo em pt-BR
```

### Regras de Formatação
- **Resumo no imperativo**: "adiciona", não "adicionado".
- **Máximo 72 caracteres** na primeira linha.
- **Corpo opcional** separado por linha em branco.
- **Escopo em minúsculas**: `[a-z0-9._/-]+`.

### Tipos Permitidos
| Tipo | Descrição / Uso |
| :--- | :--- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `chore` | Tarefas de manutenção ou configuração |
| `docs` | Documentação |
| `style` | Formatação e estilo (sem mudança de lógica) |
| `refactor` | Refatoração de código |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `ci` | Integração contínua e pipelines |
| `build` | Build e gerenciamento de dependências |
| `revert` | Reversão de commits anteriores |
| `merge` | Merge de branches |