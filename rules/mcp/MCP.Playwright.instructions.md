# MCP (Model Context Protocol) - Playwright Browser Integration

## O que é o MCP do Playwright?

O Model Context Protocol (MCP) do Playwright integra capacidades de automação de navegador diretamente ao assistente de IA. Isso permite que o assistente de IA navegue em URLs, interaja com páginas web, tire screenshots e valide comportamentos de interface em tempo real, agindo como um agente de testes autônomo.

> **Objetivo**: Quando for necessário executar testes E2E, verificar o comportamento visual de páginas, ou interagir com interfaces web em execução (localhost ou produção), use as ferramentas do **Playwright MCP**.

### Quando Usar
- Para validar se uma funcionalidade implementada renderiza corretamente.
- Para realizar testes end-to-end (E2E) exploratórios.
- Para capturar o estado atual da aplicação (Snapshot/Screenshot) para debugging sem sair do editor.
- Para simular interações de usuário (login, preenchimento de formulários, navegação).

## Ferramentas Principais Disponíveis

As ferramentas normalmente são prefixadas (ex: `mcp_playwright_browser_*`).

| Ferramenta | Descrição |
|------------|-----------|
| `browser_navigate` | Abre uma URL no navegador controlado. |
| `browser_snapshot` | Captura a árvore de acessibilidade/DOM da página. **Essencial para descobrir seletores/IDs.** |
| `browser_click` | Clica em elementos usando referências obtidas no snapshot. |
| `browser_fill_form` | Preenche múltiplos campos de formulário de uma vez. |
| `browser_take_screenshot` | Tira um print da tela para verificação visual. |
| `browser_run_code` | Executa scripts Playwright customizados para interações complexas ou específicas. |
| `browser_console_messages` | Lê logs do console do navegador (útil para verificar erros de JS). |

## Fluxo de Uso Recomendado

O Playwright não "vê" a tela a menos que você peça. Siga este fluxo:

1. **Navegar**: Use `browser_navigate` para acessar a URL (ex: `http://localhost:<porta>/login`).
2. **Inspecionar**: Execute `browser_snapshot` imediatamente após navegar. Isso retorna uma representação textual da página com **IDs numéricos** ou referências que a IA pode usar.
3. **Interagir**: Use os IDs retornados pelo snapshot para clicar (`browser_click`) ou digitar (`browser_type`).
4. **Validar**:
   - Use `browser_take_screenshot` para confirmar visualmente.
   - Use `browser_console_messages` para checar erros.
   - Use `browser_snapshot` novamente para ver se o estado da tela mudou.

## Boas Práticas

### 1. Sempre faça Snapshot antes de Interagir
Não tente "adivinhar" seletores como `#button-login` ou `text="Entrar"`. O `browser_snapshot` fornece referências confiáveis que garantem que o elemento existe e é interativo.

### 2. Use `browser_run_code` para Scripts Complexos
Se a tarefa envolve muitos passos pequenos (ex: mudar um select, esperar um request, clicar num botão), é mais rápido e confiável enviar um script Playwright puro via `browser_run_code` do que fazer 4 chamadas de ferramentas separadas.

Exemplo de `browser_run_code`:
```javascript
async (page) => {
  await page.getByLabel('E-mail').fill('usuario@exemplo.com');
  await page.getByLabel('Senha').fill('senha123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  // Esperar navegação
  await page.waitForURL('**/dashboard');
  return await page.title();
}
```

### 3. URLs Locais
Confirme em qual porta a aplicação está rodando antes de navegar (verifique o `package.json`, o `vite.config`/config do bundler, ou os terminais abertos).

> **Configuração por projeto.** O mapa de aplicações e portas locais é específico de
> cada workspace e deve ser declarado no `CLAUDE.md` do projeto, por exemplo:
>
> ```markdown
> - <Nome do app>: `http://localhost:<porta>`
> ```

## Configuração Realizada

### Arquivo MCP (.vscode/mcp.json)

Esta configuração habilita o servidor MCP do Playwright no VS Code.

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "env": {}
    }
  }
}
```
