---
name: supabase-convencoes
description: 'Convenções de nomenclatura para tabelas, colunas, índices, constraints e objetos do banco. Use ao criar ou editar migrations e objetos SQL, ou ao modelar o schema do Supabase.'
---

# Convenções de Nomenclatura — Supabase

Valida nomenclatura de objetos do banco seguindo as convenções do projeto.

## 🎯 Validações

### Convenções de Nomenclatura

#### Tabelas

- ✅ **Entidades**: Plural, snake_case (`alunos`, `cursos_oferecidos`)
- ✅ **Classificação**: Prefixo `tipo_` (`tipo_pagamento`, `tipo_curso`)
- ✅ **Junção**: Compostos no plural (`alunos_cursos`, `usuarios_permissoes`)
- ✅ **Temporárias**: Prefixo `tmp_` (`tmp_processamento_pagamentos`)
- ✅ **Histórico**: Prefixo `hist_` (`hist_alunos`, `hist_pagamentos`)
- ✅ **Backup**: Prefixo `bkp_` (`bkp_alunos_20241016`)

#### Colunas

- ✅ **Chave primária**: Sempre `id` (BIGINT, nunca UUID)
- ✅ **Chave estrangeira**: Formato `fk_id_entidade` (`fk_id_aluno`)
- ✅ **Datas**: Prefixo `data_` (`data_nascimento`, `data_matricula`)
- ✅ **Booleanos**: Sufixo `_ativo` (`aluno_ativo`, `curso_ativo`)
- ✅ **Monetários**: Sufixo `_valor` (`pagamento_valor`)
- ✅ **Descrições**: Sufixo `_descricao` (`curso_descricao`)

#### Objetos do Banco

- ✅ **Índices**: `idx_tabela_colunas` (`idx_alunos_email`)
- ✅ **Constraints UNIQUE**: `unq_tabela_colunas` (`unq_alunos_cpf`)
- ✅ **Constraints CHECK**: `chk_tabela_condicao` (`chk_alunos_idade`)
- ✅ **Foreign Keys**: `fk_tabela_coluna` (`fk_alunos_curso`)
- ✅ **Triggers**: `tr_tabela_acao` (`tr_alunos_audit`)
- ✅ **Functions**: `fn_acao_tabela` (`fn_validar_aluno`)
- ✅ **Views**: `vw_descricao` (`vw_alunos_ativos`)
- ✅ **Procedures**: `sp_procedimento` (`sp_processar_pagamentos`)
- ✅ **Sequences**: `seq_tabela_coluna` (`seq_alunos_id`)

## 🔍 Detecções Automáticas

### Problemas de Nomenclatura

## When NOT to use

- Não usar quando houver necessidade de adaptação para sistemas legados sem migração coordenada.

## Manual verification steps

1. Validar nomes de novos objetos em uma checklist antes de aplicar migration.
2. Conferir índices e constraints com o DBA ou owner do schema.
3. Documentar alterações no changelog de migrations.

### Problemas de Nomenclatura

```sql
-- ❌ Detectado: Nomes incorretos
CREATE TABLE Usuario (          -- Deveria ser 'usuarios'
    ID UUID PRIMARY KEY,       -- Deveria ser 'id BIGINT'
    tipoUsuario VARCHAR(50),   -- Deveria ser FK para 'tipo_usuarios'
    dataCreated TIMESTAMP      -- Deveria ser 'created_at'
);

-- ✅ Sugerido: Nomenclatura correta
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY,
    fk_id_tipo_usuario BIGINT REFERENCES tipo_usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Estrutura de Auditoria

```sql
-- Skill sugere automaticamente para tabelas críticas:
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_by BIGINT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_by BIGINT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS deleted_by BIGINT;
```

## 🛠️ Verificações por Tipo

### Chaves e Relacionamentos

```sql
-- Valida padrões de FK
❌ user_id → ✅ fk_id_usuario
❌ courseType → ✅ fk_id_tipo_curso
❌ UUID keys → ✅ BIGINT keys
```

### Tipos de Dados

```sql
-- Detecta tipos inadequados
❌ TIMESTAMPZ → ✅ TIMESTAMP
❌ VARCHAR sem limite → ✅ VARCHAR(255)
❌ TEXT para enum → ✅ FK para tabela tipo_*
```

### Convenções Específicas

```sql
-- Status e Tipos como FK (não ENUM)
❌ status VARCHAR(20) → ✅ fk_id_status_pagamento BIGINT
❌ tipo VARCHAR(30) → ✅ fk_id_tipo_usuario BIGINT
```

## 📋 Validações por Schema

### Schema `public` (Principal)

- Tabelas de entidades principais
- Convenções de auditoria obrigatórias
- Relacionamentos bem definidos

### Schemas específicos do projeto

Alguns projetos organizam módulos em schemas próprios (além de `public`). As convenções de nomenclatura acima valem para qualquer schema; a lista de schemas específicos e seu propósito fica documentada no `CLAUDE.md` de cada projeto — não hardcode nomes de schema aqui, pois variam por projeto.

## ⚡ Gatilhos de Ativação

- Criação de migrations (`.sql`)
- Comandos `CREATE TABLE`
- Comandos `ALTER TABLE`
- Definição de constraints e índices
- Criação de functions/triggers

## 🎯 Exemplos de Correções

### Tabela de Entidade

```sql
-- Antes (Detectado)
CREATE TABLE User (
    userID UUID PRIMARY KEY,
    firstName VARCHAR,
    userType VARCHAR(20),
    isActive BOOLEAN
);

-- Depois (Sugerido)
CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    primeiro_nome VARCHAR(100) NOT NULL,
    fk_id_tipo_usuario BIGINT REFERENCES tipo_usuarios(id),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_at TIMESTAMP,
    updated_by BIGINT
);
```

### Índices e Constraints

```sql
-- Skill sugere automaticamente
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE UNIQUE INDEX unq_usuarios_cpf ON usuarios(cpf);
ALTER TABLE usuarios ADD CONSTRAINT chk_usuarios_idade
    CHECK (idade >= 0 AND idade <= 120);
```

## 🗂️ Organização de Schemas

```
public/               -- Entidades principais
├── usuarios
├── tipo_usuarios
└── permissoes

<schema_do_modulo>/   -- Schema específico de um módulo (nome definido por projeto)
├── ...
```

---

**Baseado em**: `rules/backend/BACKEND.Supabase.Nomenclatura.instructions.md`
