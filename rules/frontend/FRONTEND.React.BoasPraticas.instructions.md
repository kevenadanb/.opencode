---
description: Boas práticas e padrões React para aplicações web modernas
---

# Boas Práticas React

## Estrutura de Componentes

- Use componentes funcionais ao invés de componentes de classe
- Mantenha componentes pequenos e focados
- Extraia lógica reutilizável em hooks customizados
- Use composição ao invés de herança
- Implemente tipos apropriados de propriedades com TypeScript
- Divida componentes grandes em componentes menores e focados

## Hooks

- Siga as Regras dos Hooks
- Use hooks customizados para lógica reutilizável
- Mantenha hooks focados e simples
- Use arrays de dependências apropriados no useEffect
- Implemente limpeza no useEffect quando necessário
- Evite hooks aninhados

## Gerenciamento de Estado

- Use useState para estado local do componente
- Implemente useReducer para lógica de estado complexa
- Use Context API para estado compartilhado
- Mantenha o estado o mais próximo possível de onde é usado
- Evite prop drilling através de gerenciamento de estado adequado
- Use bibliotecas de gerenciamento de estado apenas quando necessário

## Performance

- Implemente memoização adequada (useMemo, useCallback)
- Use React.memo para componentes custosos
- Evite re-renderizações desnecessárias
- Implemente lazy loading adequado
- Use propriedades key adequadas em listas
- Perfile e otimize performance de renderização

## Formulários

- Use componentes controlados para inputs de formulário
- Implemente validação adequada de formulários
- Gerencie estados de submissão adequadamente
- Mostre estados de carregamento e erro apropriados
- Use bibliotecas de formulário para formulários complexos
- Implemente acessibilidade adequada para formulários

## Tratamento de Erros

- Implemente Error Boundaries
- Gerencie erros assíncronos adequadamente
- Mostre mensagens de erro amigáveis ao usuário
- Implemente UI de fallback adequada
- Registre erros apropriadamente
- Gerencie casos extremos graciosamente

## Testes

- Escreva testes unitários para componentes
- Implemente testes de integração para fluxos complexos
- Use React Testing Library
- Teste interações do usuário
- Teste cenários de erro
- Implemente dados mock adequados

## Acessibilidade

- Use elementos HTML semânticos
- Implemente atributos ARIA adequados
- Garanta navegação por teclado
- Teste com leitores de tela
- Gerencie foco adequadamente
- Forneça texto alternativo adequado para imagens

## Organização de Código

- Agrupe componentes relacionados juntos
- Use convenções adequadas de nomenclatura de arquivos
- Implemente estrutura de diretórios adequada
- Mantenha estilos próximos aos componentes
- Use imports/exports adequados
- documente lógica complexa de componentes

## Ferramentas Disponíveis

- 'docs': Pesquisa documentação em react.dev. Retorna o texto como uma string.

- 'compile': Executa o código do usuário através do React Compiler. Retorna código JS/TS otimizado com possíveis diagnósticos.

## Processo

Analise o código do usuário em busca de oportunidades de otimização:

- Verifique se há anti-padrões do React que impedem a otimização do compilador

- Identifique otimizações manuais desnecessárias (useMemo, useCallback, React.memo) que o compilador pode lidar

- Procure por problemas na estrutura do componente que limitam a eficácia do compilador

- Pense em cada sugestão que você está fazendo e consulte a documentação do React usando o recurso docs://{query} para obter as melhores práticas

Use o React Compiler para verificar o potencial de otimização:

- Execute o código através do compilador e analise a saída

- Você pode executar o compilador várias vezes para verificar seu trabalho

- Verifique se a otimização foi bem-sucedida procurando por entradas de cache const $ = \_c(n), onde n é um inteiro

- Identifique mensagens de "bailout" que indicam onde o código pode ser melhorado

- Compare o potencial de otimização antes/depois

Forneça orientações acionáveis:

- Explique as alterações específicas do código com raciocínio claro

- Mostre exemplos de antes/depois ao sugerir alterações

- Inclua os resultados do compilador para demonstrar o impacto das otimizações

- Sugira apenas alterações que melhorem significativamente o potencial de otimização
