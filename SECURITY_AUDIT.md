# Auditoria de Segurança - PEPEK GRUPO

Data: 2026-08-24  
Stack: React 19 + Vite + Vercel Functions + Supabase

## Resultado

1. Chaves públicas vs. privadas .......... 🔧 Corrigido
2. Segredos hardcoded ..................... 🔧 Corrigido
3. RLS / regras de banco de dados ......... 🔧 Corrigido no schema; aplicar no projeto Supabase antes do deploy
4. Páginas internas sem autenticação ...... 🔧 Corrigido
5. SQL Injection ........................... ✅ OK - não existem queries SQL concatenadas
6. Itens extras de higiene ................. 🔧 Corrigido

## Problemas encontrados

- A configuração pública do Supabase possuía valores de fallback hardcoded no frontend.
- Perfis fictícios podiam ser acionados pela interface de produção e restaurados pelo armazenamento local.
- Existia uma senha de demonstração hardcoded no bundle do frontend.
- O schema permitia inserção anónima direta na tabela `bookings`, contornando validação e rate limiting do servidor.
- O estado interno do Odoo podia ser consultado por qualquer conta autenticada, independentemente do perfil.
- Alguns endpoints públicos não tinham validação comum de origem, método, frequência e formato de entrada.
- Os acessos corporativo e particular não estavam suficientemente diferenciados na experiência de login.

## Correções aplicadas

- Removidos valores reais de fallback e credenciais demo do código entregue ao navegador.
- Perfis demo limitados ao modo de desenvolvimento, com dupla proteção na interface e no contexto de autenticação.
- Login real separado em Conta Corporativa e Cliente Particular, com campos, contexto e avisos próprios.
- Endpoints protegidos com cabeçalhos `no-store`, validação de origem/método, rate limiting e limpeza de entradas.
- Reservas e disponibilidade exigem `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor.
- Validação de e-mail, telefone, datas, lotação e limites de tamanho antes da persistência.
- Consulta e sincronização Odoo exigem sessão válida e perfil autorizado.
- Matriz de permissões por função aplicada na interface e no carregamento de dados.
- RLS separa registos próprios de clientes dos acessos globais de frota, finanças e operações.
- Comparação de token interno realizada em tempo constante.
- RLS atualizado para negar escrita anónima em reservas e impedir clientes de alterar `role` ou `tier`.
- Política de reservas alterada para associação explícita por `user_id`, sem correspondência apenas por e-mail.
- Cabeçalhos de isolamento e CSP reforçados na Vercel.
- Auditoria de dependências: 0 vulnerabilidades conhecidas em produção e desenvolvimento.
- Carrosséis automáticos ajustados para 7-7,5 segundos, com pausa durante interação e respeito por `prefers-reduced-motion`.
- Pagamentos passaram a usar ordens criadas no servidor, valor obtido da fatura e chave de idempotência.
- Dados de cartão, PIN, CVV e códigos bancários deixaram de ser recolhidos pelo frontend.
- Liquidação Stripe ocorre exclusivamente por webhook HMAC assinado, com tolerância temporal de 5 minutos.
- Multicaixa, transferência e MB WAY permanecem pendentes até reconciliação por perfil financeiro autorizado.
- Eventos de pagamento são auditados, recibos possuem hash de integridade e clientes só leem os próprios registos por RLS.

## Ação operacional obrigatória

Executar o conteúdo atualizado de `supabase/schema.sql` no projeto Supabase de produção. A alteração revoga a inserção anónima em `bookings`, restringe a atualização de perfis e aplica a leitura de reservas por `user_id`.

Confirmar na Vercel que estas variáveis existem apenas no servidor:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `ODOO_API_TOKEN`
- `CRM_SYNC_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SITE_URL`

Antes de ativar cobranças, executar `supabase/schema.sql` em produção e registar no Stripe o webhook HTTPS `/api/payments-webhook-stripe`. Multicaixa Express/EMIS, BAI/BFA e MB WAY exigem contratos e credenciais oficiais dos respetivos provedores; enquanto não existirem, o sistema emite apenas uma referência pendente e não declara pagamento concluído.

Variáveis `VITE_*` são públicas por definição e não podem conter segredos.

## Rotina antes de cada publicação

- [ ] Executar `npm test` e `npm run build`.
- [ ] Executar `npm audit` e exigir zero vulnerabilidades altas ou críticas.
- [ ] Procurar segredos no código e no bundle `dist`.
- [ ] Confirmar que o modo demo está desligado em produção.
- [ ] Testar acesso cruzado: utilizador A não lê dados do utilizador B.
- [ ] Testar que perfil particular recebe 403 nos endpoints administrativos.
- [ ] Rever variáveis da Vercel e rotacionar qualquer credencial exposta.
- [ ] Confirmar backups e contactos do plano de resposta a incidentes.
- [ ] Testar webhook com evento assinado, valor/moeda divergente, repetição e evento expirado.
- [ ] Confirmar que somente `contabilista`, `gestor_portugal` e `direcao` reconciliam transferências.
