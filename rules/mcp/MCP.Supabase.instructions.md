```instructions
# Contexto do Banco de Dados Supabase

## Como Usar Este Contexto

Quando estiver trabalhando no projeto ou precisa analisar o banco de dados, siga estas diretrizes para usar o MCP do Supabase de forma eficaz:

1. Use o MCP do Supabase para obter informações atualizadas sobre o schema do banco  *QUANDO PRECISAR*
      - Evite listar todas as tabelas ou views de uma vez, pois isso pode ser desnecessário e consumir recursos.
      - Utilize comandos específicos para obter detalhes de tabelas ou views conforme necessário.
      - Antes de executar migrations sempre mostre o SQL para o usuário confirmar.
2. Considere as relações entre as tabelas ao sugerir mudanças
3. Antes de criar views execute o Select para confirmar se funciona


## Resumo Geral

Este arquivo serve como referência para manter o contexto do projeto e sua conexão com o banco de dados Supabase durante o desenvolvimento, portanto use sua ferramenta mcp conforme instruções acima sempre que perceber que o contexto do banco de dados é necessário.

```

## Nome do servidor MCP varia por projeto

O nome do servidor Supabase no MCP **não é sempre `supabase`** — cada projeto deste workspace registra o seu com um nome próprio (ex.: `aemasul-db`, `cci-database`, `cobranca-db`, `is-cantina-db`, `is-cobranca-database`). Por isso, os agentes (`agente-backend`, `agente-requisitos`, `agente-testes`, `agente-qualidade`) declaram `mcp__*` no `tools:` do próprio frontmatter, em vez de fixar um nome — isso garante que funcionam em qualquer projeto sem precisar editar o agente a cada instalação.

Ao usar uma ferramenta de banco, identifique o servidor correto entre as ferramentas disponíveis com prefixo `mcp__<nome>__` (`list_tables`, `execute_sql`, `apply_migration`, `list_migrations`, `generate_typescript_types`, `get_advisors`, `list_edge_functions`, `deploy_edge_function`). Normalmente há um único servidor desse tipo configurado no projeto. Se houver mais de um e não estiver óbvio qual corresponde ao projeto atual, pergunte ao usuário antes de prosseguir — nunca escolha arbitrariamente entre bancos de projetos diferentes.
