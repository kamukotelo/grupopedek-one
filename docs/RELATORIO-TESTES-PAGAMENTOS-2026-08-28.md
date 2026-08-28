# Relatório de testes de pagamentos

**Data:** 28 de agosto de 2026  
**Ambiente verificado:** código local e produção `grupopedek-one.vercel.app`  
**Tipo de teste:** segurança e validação sem criar cobrança, fatura ou ordem de pagamento.

## Resultado executivo

O fluxo está protegido contra criação e consulta anónima de pagamentos. A liquidação Stripe exige um webhook assinado. Nenhuma transação financeira foi iniciada neste teste.

| Verificação | Resultado | Evidência |
|---|---|---|
| Validação do projeto | Aprovado | `npm test` concluído |
| Compilação de produção | Aprovado | `npm run build` concluído |
| Criar pagamento sem sessão | Bloqueado | `POST /api/payments-create` devolveu `401` |
| Consultar pagamento sem sessão | Bloqueado | `GET /api/payments-status` devolveu `401` |
| Webhook Stripe sem assinatura | Bloqueado | `POST /api/payments-webhook-stripe` devolveu `400` |
| Dados de cartão no frontend | Não recolhidos | Validado pelo teste interno do projeto |
| Valor do pagamento | Controlado pelo servidor | A ordem usa o valor registado na fatura, não o valor enviado pelo navegador |
| Idempotência | Implementada | A mesma chave não cria uma nova ordem para o mesmo utilizador |

## Comportamento confirmado

1. Um visitante sem sessão autenticada não consegue criar uma ordem de pagamento.
2. Um visitante sem sessão não consegue consultar uma ordem existente.
3. Um evento falso de Stripe, sem assinatura válida, é rejeitado antes de qualquer alteração de fatura.
4. O fluxo Stripe compara valor e moeda recebidos com a ordem criada no servidor antes de marcar a fatura como paga.
5. Multicaixa, transferência e MB WAY permanecem pendentes até reconciliação por `contabilista`, `gestor_portugal` ou `direcao`.

## Não testado neste ciclo

Estes pontos precisam de ambiente de teste configurado e devem ser executados antes de ativar cobranças reais:

- criação de Checkout Stripe com chave de teste;
- webhook Stripe assinado de teste, incluindo repetição do mesmo evento;
- fatura com EUR, USD e AOA e respetiva reconciliação;
- tentativa de pagamento de fatura pertencente a outro utilizador;
- reconciliação manual por um perfil financeiro e bloqueio para perfil de cliente;
- expiração, cancelamento, reembolso e falha de pagamento;
- contrato e integração oficial de Multicaixa Express, banco e MB WAY.

## Condição para ativar pagamentos reais

Não ativar cobrança em produção até confirmar:

- `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` configurados somente na Vercel;
- endpoint HTTPS `/api/payments-webhook-stripe` registado no painel Stripe;
- `SUPABASE_SERVICE_ROLE_KEY` presente na produção;
- esquema `supabase/schema.sql` aplicado;
- uma fatura de teste, um cliente real de teste e os cenários acima aprovados pela equipa financeira.

## Conclusão

O sistema está pronto para o próximo passo: teste integrado com uma conta de demonstração no Supabase e Stripe em modo de teste. Ainda não deve processar dinheiro real sem a validação operacional e financeira acima.
