## Estrutura para Análise de Requisitos

### Descrição

Utilize a estrutura abaixo para analisar e documentar requisitos (preferencialmente funcionais) em formato de histórias de usuário.

Objetivo: produzir um requisito claro, testável e alinhado ao negócio, cobrindo permissões, validações, estados de erro e impactos.

### Template (história de usuário)

```
Nome: [Nome curto e específico do requisito]

Como um: [tipo de usuário/ator relevante]

Eu quero: [ação desejada, em verbo no infinitivo]

Para que eu possa: [benefício/resultado esperado]

Contexto/Problema:
- [1-3 bullets com o cenário atual e a dor]

Escopo:
- Inclui: [o que está dentro]
- Não inclui: [o que está fora]

Regras de Negócio:
1. [regra objetiva e verificável]
2. [regra objetiva e verificável]

Permissões:
- [quem pode fazer o quê; considerar perfis/RBAC quando aplicável]

Campos/Dados (se aplicável):
- [campo] — [tipo] — [obrigatório?] — [validação] — [origem]

Estados e Mensagens (se aplicável):
- Sucesso: [o que o usuário vê/recebe]
- Erro: [principais erros e mensagens/ações]

Critérios de Aceitação:
1. Dado que [pré-condição], quando [ação], então [resultado observável].
2. Dado que [pré-condição], quando [ação], então [resultado observável].
3. [cobrir validações obrigatórias]
4. [cobrir permissão/negativa de acesso]
5. [cobrir caso de erro e recuperação]

Observações/Dependências:
- [integrações, tabelas/views, endpoints, telas relacionadas, migrações, etc.]

Definição de Pronto (DoD):
- [critérios mínimos: teste, type-check, atualização de docs/prints se necessário]
```

### Diretrizes rápidas

-    Critério de aceitação deve ser _testável_ (evite “deve ser fácil/rápido/bonito”).
-    Preferir formato **Dado/Quando/Então** e resultados observáveis (UI, dados persistidos, logs/auditoria, retorno de API).
-    Sempre cobrir: caso feliz, validações, permissão, e pelo menos 1 caso de erro.
-    Se houver impacto em dados, explicitar campos, fonte e regras de consistência.
