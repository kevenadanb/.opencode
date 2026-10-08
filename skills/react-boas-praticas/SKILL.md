---
name: react-boas-praticas
description: 'Validações de boas práticas React e otimizações (hooks, memoização, performance). Use ao criar ou revisar componentes React (.tsx/.ts), ou quando o usuário pedir para melhorar performance ou qualidade de componentes.'
---

# Boas Práticas — React

Checklist e exemplos de correção de boas práticas React (hooks, memoização, performance, tratamento de erros).

## 🎯 Validações

### Anti-padrões Detectados

- ❌ Componentes de classe desnecessários
- ❌ Hooks fora das regras (condicionais, loops)
- ❌ Re-renderizações desnecessárias
- ❌ Arrays de dependências incorretos
- ❌ Memory leaks (falta de cleanup)
- ❌ Prop drilling excessivo

### Otimizações Sugeridas

- ✅ Conversão automática para componentes funcionais
- ✅ Implementação de memoização apropriada
- ✅ Lazy loading de componentes
- ✅ Hooks customizados para lógica reutilizável
- ✅ Context API para estado compartilhado

## 🛠️ Ferramentas Integradas

### Integração com React Compiler

```typescript
// Verifica otimizações automáticas
compile(userCode) → optimizedCode + diagnostics
```

### Busca de documentação

```typescript
// Busca melhores práticas
docs(query) → reactDevDocumentation
```

## 📋 Checklist Automático

Ao editar componentes React, esta skill verifica:

- [ ] **Estrutura**: Componente funcional, props tipadas
- [ ] **Hooks**: Regras seguidas, dependências corretas
- [ ] **Performance**: Memoização necessária, re-renders otimizadas
- [ ] **Estado**: Localizado próximo ao uso, sem prop drilling
- [ ] **Erros**: Tratamento de erros (error boundaries) implementado
- [ ] **Acessibilidade**: Elementos semânticos, ARIA

## 🔄 Processo Automático

1. **Análise**: Detecta padrões no código atual
2. **Compilação**: Executa React Compiler para verificar otimizações
3. **Sugestões**: Fornece correções específicas com justificativa
4. **Validação**: Re-compila para verificar melhorias

## ⚡ Gatilhos de Ativação

- Salvar arquivo `.tsx` ou `.ts` com componentes React
- Uso de hooks com dependências
- Componentes com mais de 50 linhas
- Detecção de anti-padrões conhecidos

## 🎲 Exemplos de Sugestões

**Antes (Anti-padrão)**:

```tsx
const Component = () => {
     const [data, setData] = useState([]);

     useEffect(() => {
          fetchData().then(setData);
     }); // ❌ Dependências faltando

     return data.map((item) => <div>{item.name}</div>); // ❌ Key faltando
};
```

**Depois (Otimizado)**:

```tsx
const Component = memo(() => {
     const [data, setData] = useState<Item[]>([]);

     useEffect(() => {
          fetchData().then(setData);
     }, []); // ✅ Array vazio para executar uma vez

     return data.map((item) => (
          <div key={item.id}>{item.name}</div> // ✅ Key única
     ));
});
```

## When NOT to use

- Não usar quando a análise é puramente conceitual e não está implementada no código (documentar como orientação no instruction associado).
- Não aplicar automáticamente em refactors que mudem a lógica sem revisão de performance.

## Manual verification steps

1. Revisar PRs com mudanças em componentes React e confirmar que hooks seguem regras (dependências, cleanups).
2. Executar testes de unidade e validar que componentes memoizados não regrediram (snapshot/benchmarks).
3. Revisar casos de uso em Storybook para confirmar comportamento visual e performance.

---

**Baseado em**: `rules/frontend/FRONTEND.React.BoasPraticas.instructions.md`
