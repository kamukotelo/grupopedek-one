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

## Blogue e newsletter (`/painel/blogue`)

A equipa publica notícias no blogue (texto + fotografia ou vídeo) e consulta os
subscritores da newsletter em `https://pepekgrupo.com/painel/blogue`.

1. As tabelas são criadas automaticamente pela API no primeiro pedido (`getBlogDatabase`
   em `api/_blog.js`). O ficheiro `neon/migrations/20261010_blog_newsletter.sql` tem o
   mesmo esquema, caso se prefira aplicá-lo à mão no SQL Editor do Neon.
2. Dar acesso a quem vai publicar (perfis com acesso: `direcao`, `gestor_portugal`
   e `marketing`):
   ```sql
   UPDATE public.profiles SET role = 'marketing'
    WHERE id = (SELECT id FROM neon_auth."user" WHERE email = 'pessoa@pepekgrupo.com');
   ```
3. Para vídeos, definir `MUX_TOKEN_ID` e `MUX_TOKEN_SECRET` nas variáveis de ambiente
   da Vercel (Mux → Settings → Access Tokens, permissão Mux Video: Read + Write).
   Sem estas variáveis, as notícias com fotografia ou só texto funcionam na mesma.

As fotografias são reduzidas no navegador (máx. 1600 px) e guardadas na base de
dados; os vídeos vão directamente do navegador para o Mux.
