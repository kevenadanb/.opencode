Este documento define os padrões de nomenclatura a serem seguidos ao criar e gerenciar objetos no banco de dados Supabase. Seguir essas convenções ajuda a manter a consistência, clareza e facilidade de manutenção do banco de dados.

-    Use sempre português brasileiro para nomes de tabelas, colunas, índices, constraints, triggers, funções, views e procedimentos armazenados.
-    Nunca usamos Timestampz, apenas timestamp.
-    Chaves Estrangeiras devem ter o prefixo "fk_id_entidade" quando se trata de chave primaria.
-    Índices devem ter o prefixo "idx\_" seguido do nome da tabela e colunas indexadas.
-    Nomes de constraints UNIQUE devem ser "unq\_" seguido do nome da tabela e colunas.
-    Nomes de constraints CHECK devem ser "chk\_" seguido do nome da tabela e condição.
-    Nomes de constraints FOREIGN KEY -> PRIMARY KEY devem ser "fk_id" seguido do nome da tabela e coluna.
-    Nomes de triggers devem ser "tr\_" seguido do nome da tabela e ação.
-    Nomes de funções devem ser "fn\_" seguido do nome da ação e tabela.
-    Nomes de views devem ser "vw\_" seguido do nome descritivo da view.
-    Nomes de procedimentos armazenados devem ser "sp\_" seguido do nome do procedimento.
-    Nomes de sequências devem ser "seq\_" seguido do nome da tabela e coluna.
-    Nomes de schemas devem ser descritivos e em minúsculas, usando underscore_case para separar palavras.
-    Nomes de tabelas devem ser no plural e em minúsculas, usando underscore_case para separar palavras.
-    Nomes de colunas devem ser em minúsculas, usando underscore_case para separar palavras.

---

Nomenclatura de Tabelas

-    Entidades: nomes no plural, ex: `alunos`, `cursos_oferecidos`
-    Tabelas de classificação: prefixo `tipo_`, ex: `tipo_pagamento`, `tipo_curso`
-    Tabelas de junção: nomes compostos no plural, ex: `alunos_cursos`
-    Tabelas temporárias: prefixo `tmp_`, ex: `tmp_processamento_pagamentos`
-    Tabelas de histórico: prefixo `hist_`, ex: `hist_alunos`, `hist_pagamentos`
-    Tabelas de backup: prefixo `bkp_`, ex: `bkp_alunos_20241016`

Nomenclatura de Colunas

-    Nomes de colunas devem ser em minúsculas, usando underscore_case para separar palavras.
-    Colunas que armazenam identificadores devem SER `id`.
-    Colunas que armazenam chaves estrangeiras devem ser no formato `fk_id_entidade`, ex: `fk_id_aluno`, `fk_id_curso`
-    Colunas que armazenam datas devem ter o prefixo `data_`, ex: `data_nascimento`, `data_matricula`
-    Colunas que armazenam valores booleanos devem ter o sufixo `_ativo`, ex: `aluno_ativo`, `curso_ativo`
-    Colunas que armazenam valores monetários devem ter o sufixo `_valor`, ex: `pagamento_valor`, `curso_valor`