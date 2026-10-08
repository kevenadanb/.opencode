---
name: atualizar-changelog
description: 'Padrões para manter o changelog no formato Keep a Changelog. Use ao atualizar, escrever ou organizar o CHANGELOG, registrar mudanças de versão ou entradas Added/Changed/Fixed/Removed.'
---

# Skill de Atualização de Changelog

Esta skill define o padrão de formato e categorias para atualização dos arquivos de changelog do projeto.

## 📝 Formato Padrão

Utilize sempre o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/). Comece sempre pelo topo (versões mais recentes).

```markdown
# Changelog

## [1.0.1] - 2025-XX-XX

### Added

- Nova funcionalidade X.

### Changed

- Atualizado fluxo Y para considerar novos parâmetros.

### Fixed

- Correção de erro ao calcular Z (Issue #123).
```

## 🏷️ Categorias

Use estas categorias para agrupar as mudanças:

- **Added**: para novas funcionalidades.
- **Changed**: para alterações em funcionalidades existentes.
- **Deprecated**: para funcionalidades que serão removidas em breve.
- **Removed**: para funcionalidades removidas agora.
- **Fixed**: para qualquer correção de bug.
- **Security**: para convidar usuários a atualizar em caso de vulnerabilidades.

## 💡 Dicas de Escrita

1.   **Foco no Usuário:** Escreva "Adicionado filtro de registros" em vez de "Criado componente FilterButton".
2.   **Links:** Sempre que possível, linke os PRs ou Issues relacionados: `(PR #42)`.
3.   **Data:** Use o formato ISO `YYYY-MM-DD`.
