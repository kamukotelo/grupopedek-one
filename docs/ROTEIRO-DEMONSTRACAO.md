# Roteiro de demonstração — PEPEK GRUPO

## Preparação segura

Use o ambiente local ou uma implantação de staging isolada com `VITE_DEMO_MODE=true`. Não active esta variável no domínio público de produção. Todos os nomes, matrículas, faturas e movimentos apresentados no modo demo são fictícios.

## Jornada principal do cliente

1. Abra a página inicial e apresente os idiomas PT, EN e FR.
2. Entre em **Serviços** e mostre a vitrine automática. Ela percorre somente as 47 viaturas da base oficial PEPEK.
3. Pause a vitrine com o cursor, selecione uma viatura e apresente descrição, passageiros, bagagem, transmissão e disponibilidade.
4. Clique em **Ver categoria** para abrir a frota filtrada ou **Solicitar esta viatura** para abrir `/reservar?viatura=...` com o modelo pré-selecionado.
5. Na reserva, escolha serviço, datas, modalidade com ou sem motorista e preencha a identificação demonstrativa.
6. Submeta a ficha e apresente o protocolo criado. Explique que a disponibilidade final é confirmada pela operação.
7. Clique em **Continuar para Portal & Fatura Demo**.
8. Selecione **Cliente VIP Diplomático** ou **Cliente PME / Normal**.
9. Abra **Minhas Faturas & Recibos**, escolha uma fatura pendente e clique em **Pagar Agora**.
10. Para Angola, selecione **Multicaixa Express** ou **BAI Direto**. Para Portugal, selecione **MB WAY**; para cartão internacional, selecione **Stripe**.
11. Clique em **Simular Pagamento**. Mostre o estado **Fatura fechada / liquidada na demonstração**, o código demonstrativo, o canal e a data.
12. Feche o recibo e confirme que a fatura aparece como **Liquidada** e deixou de apresentar o botão de pagamento.

## Nove utilizadores demonstrativos

1. **Cliente VIP Diplomático** — viaturas atribuídas, faturas, pagamentos e requisição prioritária.
2. **Cliente PME / Normal** — jornada normal de cliente, viaturas, faturas e pedido adicional.
3. **Vendedor CRM** — visão comercial e operacional da frota, sem controlos financeiros ou ERP.
4. **Gestor de Reservas** — despacho, frota global e acompanhamento da integração operacional.
5. **Director de Frotas** — telemetria, disponibilidade, manutenção e integração ERP.
6. **Motorista Protocolar** — viaturas, atribuições, localização e estado operacional; sem finanças.
7. **Contabilista AGT** — faturas, liquidação, reconciliação e integração ERP.
8. **Gestor Portugal** — acompanhamento financeiro internacional, Stripe/MB WAY e ERP.
9. **Direcção Executiva** — visão global de frota, finanças e integração administrativa.

## Demonstração rápida por perfil

- Para clientes: escolha o perfil, abra **Minhas Viaturas**, depois **Minhas Faturas**, liquide uma fatura e termine em **Requisição Prioritária**.
- Para Vendedor CRM: mostre a frota global e explique a passagem do pedido para a central de reservas.
- Para Gestor de Reservas: mostre frota e ERP, destacando despacho e cotações.
- Para Director de Frotas: mostre estados, combustível, quilometragem e manutenção.
- Para Motorista: mostre apenas os dados necessários à execução operacional.
- Para Contabilista: mostre fatura pendente, pagamento e estado liquidado.
- Para Gestor Portugal: liquide uma fatura por MB WAY e mostre o valor de referência em euros.
- Para Direcção: percorra frota, finanças e ERP como resumo executivo.

## Encerramento da apresentação

Reforce que nenhuma cobrança bancária ocorre no modo demo. A produção usa autenticação real, endpoints protegidos e somente integrações configuradas e auditadas.
