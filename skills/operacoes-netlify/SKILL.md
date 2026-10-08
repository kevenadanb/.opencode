---
name: operacoes-netlify
description: 'Comandos e instruções para interagir com a Netlify via MCP (deploy, logs, builds, functions, domínios). Genérica — a lista de sites de cada projeto fica no CLAUDE.md do próprio projeto. Use ao publicar/fazer deploy, ver logs de build, checar status de deploy, functions ou domínios de qualquer projeto hospedado na Netlify.'
---

# Skill de Operações Netlify

Esta skill fornece acesso e instruções para gerenciar os projetos hospedados na Netlify usando ferramentas MCP.

## 🛠️ Ferramentas Disponíveis

| Tool               | Função                                               |
| :----------------- | :--------------------------------------------------- |
| `list_sites`       | Lista sites disponíveis na conta                     |
| `get_deploy`       | Verifica status de um deploy específico              |
| `get_build_log`    | 🚨 Essencial para debugar falhas de build/deploy     |
| `list_env_vars`    | Verifica configurações de ambiente                   |
| `get_function_log` | Logs de execução de Serverless Functions             |

## 🌐 Projetos na Netlify

> **Configuração por projeto.** Esta skill é genérica e não guarda dados de nenhum
> cliente. A lista de sites, nomes e domínios de cada workspace deve ser declarada
> no `CLAUDE.md` do projeto, numa tabela como a abaixo. Se ainda não souber os nomes,
> use `list_sites` para descobri-los.

```markdown
| Projeto        | Nome no Netlify   | URL Produção          |
| :------------- | :---------------- | :-------------------- |
| <Nome do app>  | `<slug-netlify>`  | <dominio-de-producao> |
```

## 🧪 Casos de Uso Comuns

### Debugar Falha de Build

1.   Use `list_deploys` para pegar o ID do último deploy falho.
2.   Use `get_build_log` com esse ID para ler o erro.
3.   Analise o erro e sugira correção.

### Verificar Variáveis de Ambiente

- "Quais variáveis estão no site `<slug>`?" -> Use `list_env_vars`.

### Monitorar Funções em Produção

- "Por que a função X falhou?" -> Use `list_functions` para achar o nome e `get_function_log` para ver os erros.

## ⚠️ Atenção

- Não use essas ferramentas para configurações locais (`localhost`). Elas interagem com a **produção** ou **preview** na nuvem.
