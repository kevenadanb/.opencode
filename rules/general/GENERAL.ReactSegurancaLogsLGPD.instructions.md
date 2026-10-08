---
name: react-seguranca-logs-lgpd
description: "Revisa e previne vazamento de dados sensíveis (PII, CPFs, contas), credenciais e tokens em logs, localStorage, sessionStorage, cookies e telemetria. Use ao manipular dados de usuários, persistência local ou sanitizar mensagens de erro."
---

# Segurança de Logs, Armazenamento Local e LGPD

Diretrizes de proteção contra exposição de dados sensíveis e conformidade com a LGPD (Lei 13.709/2018) nas aplicações do workspace.

---

## 🎯 Objetivo

Garantir que nenhum dado pessoal identificável (PII), informação bancária ou segredo corporativo seja gravado em texto claro no navegador ou exposto em canais de log/telemetria.

---

## 🛑 Regras Críticas

### 1. Higienização Rigorosa de Logs (`console.log`)
- ❌ **NUNCA** logar:
  - Tokens de autenticação, cookies de sessão ou cabeçalhos `Authorization`.
  - Dados pessoais: CPF, nome completo, e-mail, telefone, data de nascimento.
  - Dados financeiros: número de conta, agência, saldo, contratos, faturas.
  - Respostas completas de API (`console.log(response)`) que possam conter PII.
- ✅ **Em homologação/diagnóstico**: Mascarar dados ou registrar apenas contadores/IDs técnicos não sensíveis:
  ```typescript
  console.info(`[BannerWidget] ${banners.length} banners carregados para o site ${siteId}.`);
  ```

---

### 2. Armazenamento Seguro no Navegador
- **`localStorage` / `sessionStorage`**:
  - ❌ NUNCA armazenar senhas, tokens de acesso em texto claro ou listas de clientes.
  - ✅ Usar apenas para preferências puramente cosméticas de interface (ex: `theme-mode`, `sidebar-collapsed`, `view-mode`).
- **Limpeza no Logout**:
  - Toda informação associada à sessão deve ser limpa quando o usuário encerra a sessão no portal.

---

### 3. Sanitização de Mensagens de Erro para o Usuário
- ❌ **Evitar**: Exibir stack traces Java/JavaScript, detalhes de banco de dados ou códigos internos na interface.
- ✅ **Padrão Homologado**: Exibir mensagem amigável e registrar o código de correlação técnica internamente:
  ```tsx
  {error && (
    <div className="alert alert-danger" role="alert">
      Não foi possível carregar as informações no momento. Por favor, tente novamente mais tarde.
    </div>
  )}
  ```

---

### 4. Proteção contra Segredos Hardcoded
- ❌ **NUNCA commitar**: Senhas, chaves de API privadas, certificados ou tokens em arquivos de código ou `.env`.

---

## 📋 Checklist de Segurança e LGPD

- [ ] Nenhum `console.log` expõe PII, senhas, tokens ou dados bancários.
- [ ] `localStorage` e `sessionStorage` contêm apenas preferências cosméticas de UI.
- [ ] Mensagens de erro exibidas ao usuário são amigáveis e não vazam detalhes de infraestrutura.
- [ ] Inexistência de secrets ou chaves de serviço embutidas no código-fonte.