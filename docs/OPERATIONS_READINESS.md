# Prontidão operacional — PEPEK GRUPO

## Antes de abrir reservas reais

- [ ] Aplicar `supabase/schema.sql` no projeto Supabase de produção e testar RLS com duas contas distintas.
- [ ] Confirmar que `VITE_DEMO_MODE` não existe na Vercel de produção.
- [ ] Verificar que nenhuma variável `VITE_*` contém segredo.
- [ ] Definir uma unidade física por viatura, estado de manutenção e responsável de despacho antes de confirmar qualquer pedido.
- [ ] Confirmar autorização escrita para cada logótipo de cliente e cada imagem externa usada no site.
- [ ] Aprovar a política jurídica de privacidade, retenção e pedidos dos titulares de dados.

## Pagamentos

- [ ] Registar o webhook Stripe em `/api/payments-webhook-stripe` e testar assinatura, repetição e divergência de valor.
- [ ] Manter Multicaixa, transferência e MB WAY como pendentes até haver contrato, credencial oficial e reconciliação comprovada.
- [ ] Definir taxa de câmbio, fonte, data de vigência e responsável por atualização para EUR/USD/AOA.
- [ ] Conferir diariamente ordens pendentes, recibos emitidos e falhas de webhook.

## Monitorização e resposta

- [ ] Configurar alertas para falhas de funções Vercel, erros Supabase, falhas de webhook e picos do assistente IA.
- [ ] Definir responsável de turno e contacto de escalonamento 24/7.
- [ ] Fazer backup testado de dados operacionais e financeiros.
- [ ] Rever mensalmente acessos administrativos, roles e credenciais.

## Em cada publicação

- [ ] Executar `npm test` e `npm run build`.
- [ ] Testar reserva, login, acesso cruzado entre contas, pagamento pendente e mensagem WhatsApp.
- [ ] Confirmar que a página de privacidade, logótipos e imagens correspondem à versão aprovada.
