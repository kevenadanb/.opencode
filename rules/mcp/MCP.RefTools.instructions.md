````instructions
# MCP (Model Context Protocol) - Ref Tools Integration

## O que é o MCP Ref Tools?

O Ref Tools é um MCP que permite buscar e ler documentação técnica de bibliotecas, frameworks e APIs diretamente no contexto do assistente de IA. Ele indexa documentação pública e privada para fornecer respostas precisas e atualizadas.

> **Objetivo**: Quando precisar consultar documentação de bibliotecas ou frameworks externos, use o **Ref Tools MCP** para obter informações atualizadas.

## Quando Usar

### ✅ USE para:
- Buscar documentação de bibliotecas npm/yarn
- Consultar APIs de frameworks (React, Node, Express, etc.)
- Verificar sintaxe e exemplos de uso
- Encontrar soluções para problemas específicos
- Consultar documentação de SDKs
- Buscar referências técnicas de APIs REST

### ❌ NÃO USE para:
- Documentação interna do projeto (use os arquivos `.instructions.md`)
- Documentação do MUI (use `#mui-mcp/*`)
- Schema do Supabase (use `#supabase/*`)
- Documentação da Netlify (use `#netlify/*`)

## Ferramentas Disponíveis

### Busca
- `ref_search_documentation` - Busca documentação por query
  - Inclua linguagem e framework na busca
  - Use `ref_src=private` para docs privadas

### Leitura
- `ref_read_url` - Lê conteúdo de uma URL retornada pela busca
  - Use a URL exata retornada pelo `ref_search_documentation`

## Exemplos de Uso

### Buscar Documentação React
```
Busque na documentação do React sobre useEffect cleanup
```

### Consultar API do Express
```
Como configurar middleware de autenticação no Express?
```

### Verificar Biblioteca npm
```
Qual a sintaxe do date-fns para formatar datas em pt-BR?
```

### Buscar SDK
```
Como usar o Supabase JS SDK para fazer upload de arquivos?
```

## Fluxo de Uso

1. **Buscar**: Use `ref_search_documentation` com query específica
2. **Analisar**: Revise os resultados retornados
3. **Ler**: Use `ref_read_url` para ler o conteúdo completo
4. **Aplicar**: Use as informações no código

## Boas Práticas

### Queries Efetivas
```
✅ BOM: "React useCallback dependencies array typescript"
❌ RUIM: "como usar callback"

✅ BOM: "Supabase JS SDK realtime subscription postgres changes"
❌ RUIM: "supabase realtime"

✅ BOM: "date-fns format locale pt-BR formatDistance"
❌ RUIM: "formatar data"
```

### Incluir Contexto
- Sempre mencione a linguagem (TypeScript, JavaScript)
- Inclua o nome exato da biblioteca
- Especifique a versão se relevante
- Mencione o framework se aplicável

## Configuração

### Em `.vscode/mcp.json`:

```json
{
  "servers": {
    "ref-tools": {
      "command": "npx",
      "args": ["ref-tools-mcp@latest"],
      "env": {
        "REF_API_KEY": "sua-api-key"
      }
    }
  }
}
```

## Bibliotecas Comuns no Projeto

| Biblioteca | Uso | Exemplo de Query |
|------------|-----|------------------|
| React 18 | UI | "React 18 concurrent features Suspense" |
| MUI v5/v6 | Componentes | Use `#mui-mcp/*` ao invés |
| date-fns | Datas | "date-fns format parseISO pt-BR" |
| Zod | Validação | "Zod schema validation typescript" |
| React Hook Form | Formulários | "React Hook Form useForm register" |
| TanStack Query | Data fetching | "TanStack Query useQuery mutation" |
| Supabase JS | Backend | "Supabase JS SDK auth signInWithPassword" |

## Troubleshooting

**Resultados não relevantes:**
→ Seja mais específico na query
→ Inclua nome exato da biblioteca e versão
→ Use termos técnicos em inglês

**URL não encontrada:**
→ Use a URL exata retornada pela busca
→ Tente uma nova busca com termos diferentes

**Documentação desatualizada:**
→ Especifique a versão na query
→ Verifique se há documentação mais recente disponível
````
