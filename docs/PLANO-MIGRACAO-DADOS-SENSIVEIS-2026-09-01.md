# Migração de dados sensíveis para Supabase

Data de preparação: 1 de setembro de 2026.

## Classificação adotada

1. **Público:** catálogo, preços publicados, imagens, textos institucionais e locais públicos.
2. **Pessoal/operacional:** perfis, NIF, telefone, faturas, reservas, matrículas, motoristas, telemetria, contratos e eventos Odoo. Estes dados ficam em tabelas com RLS e são entregues somente a uma sessão autorizada.
3. **Segredo técnico:** service role, chaves Stripe, tokens Odoo, chaves de IA e segredos de webhook. Estes valores **não devem ser gravados em tabelas comuns**. Permanecem em variáveis privadas da Vercel ou no Supabase Vault.

## O que foi preparado

- Migração `supabase/migrations/20260901_secure_operational_data.sql`.
- Schema `private` sem acesso para `anon` e `authenticated`.
- Tabelas protegidas para registos operacionais, eventos Odoo e cenários demo.
- Endpoint autenticado `/api/portal-data`, que valida o token e filtra dados por perfil no servidor.
- Cliente `src/lib/portalData.ts` para a transição do portal.

## Ordem segura de ativação

1. Fazer backup do Supabase.
2. Executar a migração SQL. O endpoint foi preparado para continuar a funcionar durante a transição, mesmo antes de existirem as duas tabelas operacionais novas.
3. Importar os dados fictícios em `private.demo_scenarios` e os dados reais nas tabelas públicas protegidas.
4. Validar as nove funções com contas Supabase reais e `app_metadata.role` definido pelo servidor.
5. Alterar o portal para usar exclusivamente `/api/portal-data`.
6. Remover `src/data/demoUsers.ts` somente depois da validação do staging.
7. Confirmar que `VITE_DEMO_MODE` não existe na produção.

## Regras obrigatórias

- Nunca usar prefixo `VITE_` para service role, tokens Odoo, Stripe secret ou chaves de IA: tudo com `VITE_` é incorporado no navegador.
- Nunca guardar palavra-passe de utilizador numa tabela. A senha pertence ao Supabase Auth.
- Não colocar NIF, matrícula, telefone ou documento em logs, analytics ou mensagens de erro.
- A service role só pode existir no servidor.
- Alterações de perfil e função devem ser auditadas e feitas por processo administrativo autorizado.

## Retirada do código legado

O ficheiro `src/data/demoUsers.ts` contém dados fictícios e pode permanecer temporariamente como fallback local. Ele não deve ser usado na produção. A retirada definitiva deve ocorrer após a importação dos cenários e o teste dos nove perfis, evitando quebrar a demonstração.
