# Migração para Neon

O projeto Neon dedicado usa:

- projeto: `grupopedek-one`
- região: Frankfurt (`aws-eu-central-1`)
- PostgreSQL 17
- branch: `production`
- base de dados: `pepek`
- Managed Better Auth
- Neon Data API com RLS

O ficheiro `schema.sql` é a fonte de verdade do esquema Neon. Ele substitui as
dependências de `auth.users`, `auth.uid()` e `auth.jwt()` específicas do
Supabase pelas tabelas `neon_auth` e funções JWT disponibilizadas pelo Neon.

As palavras-passe existentes do Supabase não podem ser transferidas para o
Managed Better Auth. Utilizadores reais deverão redefinir a palavra-passe ou
autenticar novamente por OAuth durante o corte definitivo.
