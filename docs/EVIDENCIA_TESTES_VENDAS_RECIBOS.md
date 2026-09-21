# Relatório de Testes de Vendas e Evidência de Pagamentos
**Data de Execução:** 21/09/2026 às 17:23:28  
**Entidade Emissora:** PEPEK GRUPO RENT-A-CAR S.A. (NIF: 5417088491)  
**Registo Comercial:** Conservatória do Registo Comercial de Luanda n.º 14.892/2018  
**Resultado dos Testes:** ✅ 46 verificações com sucesso (0 falhas)

---

## 1. Resumo Executivo dos Modelos de Pagamento Testados

Foram executados testes de ponta a ponta para todos os modelos de pagamento disponíveis no sistema PEPEK, cobrindo o ciclo completo:
1. Emissão de Fatura Comercial no servidor com montantes fixados.
2. Registo de Ordem de Pagamento no livro-razão protegido do servidor (`payment_orders`).
3. Validação de idempotência e imutabilidade de montante.
4. Processamento da transação pelo gateway com verificação de assinatura / autorização.
5. Auditoria em trilha append-only (`payment_events`).
6. Emissão de Comprovativo Oficial de Pagamento com assinatura criptográfica SHA-256 (`payment_receipts`).

| Modelo de Pagamento | Canal / Rede | Moeda | Caso de Venda | N.º Fatura | N.º Comprovativo | Hash Integridade SHA-256 |
|---|---|---|---|---|---|---|
| **Multicaixa Express** | MULTICAIXA | AOA | Aluguer Mensal Executivo Toyot... | `FT-PEPEK-2026/7962` | `REC-2026-B5929F65DD9B` | `3eefba0de30ac569...` |
| **Cartão / Stripe** | STRIPE | USD | Transfer VIP Aeroporto Interna... | `FT-PEPEK-2026/4293` | `REC-2026-2E357FEDC53D` | `ca97a548ad05f845...` |
| **Transferência Bancária** | BANK_TRANSFER | AOA | Contrato Mensal de Mobilidade ... | `FT-PEPEK-2026/4379` | `REC-2026-6CCED1573029` | `940c640e8f2799e1...` |
| **MB WAY** | MBWAY | EUR | Aluguer Semanal Mercedes-Benz ... | `FT-PEPEK-2026/8888` | `REC-2026-001449B7BCA0` | `edb7bb497b9a2b1e...` |

---

## 2. Evidências Detalhadas dos Comprovativos Emitidos


### Evidência 1: Comprovativo REC-2026-B5929F65DD9B (Multicaixa Express)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Conservatória do Registo Comercial de Luanda n.º 14.892/2018
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
COMPROVATIVO DE PAGAMENTO : REC-2026-B5929F65DD9B
Fatura Liquidada          : FT-PEPEK-2026/7962
Data e Hora de Liquidação : 2026-09-21T16:23:28.857Z
Referência de Pagamento   : PK-PAY-2026-F4AAACCAB270

DADOS DO CLIENTE:
Nome    : Embaixada Parceira de Luanda / Corpo Diplomático
NIF     : 5412345678

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Aluguer Mensal Executivo Toyota Land Cruiser 300 VXR com Motorista Protocolar
Frota     : LD-42-88-GG

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : Multicaixa Express
Comprovativo Provedor  : EMIS-MCX-1790007808857-26116ACF
Evento de Auditoria    : emis.multicaixa.settled

VALOR DO PAGAMENTO:
TOTAL PAGO / LIQUIDADO : 4 200 000,00 AOA

INTEGRITY HASH DO SISTEMA (SHA-256):
3eefba0de30ac5699b96872d13f770ce50745b363d141c1f0061889ab691083c
(Garantia técnica de integridade, imutabilidade da ordem e reconciliação)
================================================================================
```


### Evidência 2: Comprovativo REC-2026-2E357FEDC53D (Cartão / Stripe)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Conservatória do Registo Comercial de Luanda n.º 14.892/2018
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
COMPROVATIVO DE PAGAMENTO : REC-2026-2E357FEDC53D
Fatura Liquidada          : FT-PEPEK-2026/4293
Data e Hora de Liquidação : 2026-09-21T16:23:28.859Z
Referência de Pagamento   : PK-PAY-2026-414E8949E90E

DADOS DO CLIENTE:
Nome    : Global Energy Consult Ltd (UK / Staging)
NIF     : GB987654321

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Transfer VIP Aeroporto Internacional AIAAN + Escolta Huambo (Mercedes V300 Executivo)
Frota     : LD-99-10-EE

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : Cartão / Stripe
Comprovativo Provedor  : pi_test_e1a70de3f8b0e29c935308d41d391e5f
Evento de Auditoria    : stripe.checkout.session.completed

VALOR DO PAGAMENTO:
TOTAL PAGO / LIQUIDADO : $2,050.00 USD

INTEGRITY HASH DO SISTEMA (SHA-256):
ca97a548ad05f845dc8af97608434dfd9dbd0c17ae741d80999dc23e1ce32c64
(Garantia técnica de integridade, imutabilidade da ordem e reconciliação)
================================================================================
```


### Evidência 3: Comprovativo REC-2026-6CCED1573029 (Transferência Bancária)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Conservatória do Registo Comercial de Luanda n.º 14.892/2018
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
COMPROVATIVO DE PAGAMENTO : REC-2026-6CCED1573029
Fatura Liquidada          : FT-PEPEK-2026/4379
Data e Hora de Liquidação : 2026-09-21T16:23:28.860Z
Referência de Pagamento   : PK-PAY-2026-0D050E839A6E

DADOS DO CLIENTE:
Nome    : Sociedade Mineira do Catoca & Associados
NIF     : 5409871234

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Contrato Mensal de Mobilidade Corporativa — Frota de 5 Viaturas Toyota Hilux 4x4
Frota     : Frota Operacional: LD-55-11, LD-55-12, LD-55-13, LD-55-14, LD-55-15

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : Transferência Bancária
Comprovativo Provedor  : BFA-COMPROV-20260909-98124
Evento de Auditoria    : finance.reconciled

VALOR DO PAGAMENTO:
TOTAL PAGO / LIQUIDADO : 7 850 000,00 AOA

INTEGRITY HASH DO SISTEMA (SHA-256):
940c640e8f2799e150c518e97f7e672e416088c56425e5a322691c6c7dd0772c
(Garantia técnica de integridade, imutabilidade da ordem e reconciliação)
================================================================================
```


### Evidência 4: Comprovativo REC-2026-001449B7BCA0 (MB WAY)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Conservatória do Registo Comercial de Luanda n.º 14.892/2018
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
COMPROVATIVO DE PAGAMENTO : REC-2026-001449B7BCA0
Fatura Liquidada          : FT-PEPEK-2026/8888
Data e Hora de Liquidação : 2026-09-21T16:23:28.861Z
Referência de Pagamento   : PK-PAY-2026-8A2B96BC4396

DADOS DO CLIENTE:
Nome    : Eng. António Silva (Missão Técnica Lisboa-Luanda)
NIF     : PT234567890

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Aluguer Semanal Mercedes-Benz V-Class V300 VIP com Conectividade Satélite
Frota     : LD-77-33-VV

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : MB WAY
Comprovativo Provedor  : MBW-PT-MUBGFKUM-C4FEC4
Evento de Auditoria    : mbway.notification.authorized

VALOR DO PAGAMENTO:
TOTAL PAGO / LIQUIDADO : €950,00 EUR

INTEGRITY HASH DO SISTEMA (SHA-256):
edb7bb497b9a2b1ece71d942f5ca96e38db0437f9c19c019800684e4d9060825
(Garantia técnica de integridade, imutabilidade da ordem e reconciliação)
================================================================================
```


---

## 3. Verificações de Segurança e Integridade Criptográfica

- **Idempotência**: Garantida através de UUID único por tentativa de checkout, prevenindo cobranças duplicadas.
- **Validação de Webhook Stripe**: Assinatura criptográfica HMAC-SHA256 validada contra chave secreta do servidor (`stripe-signature`).
- **Prevenção de Adulteração de Montante**: Testado e comprovado que valores discrepantes são barrados antes de liquidar a fatura.
- **Segurança de Acesso Baseada em Perfis (RBAC)**: Reconciliação bancária restrita a perfis da equipa financeira (`contabilista`, `gestor_portugal`, `direcao`).
- **Rastreabilidade**: Todos os eventos possuem hash de payload arquivado em tabela auditada.

---
*Relatório gerado automaticamente pela suite de validação de vendas do Grupo PEPEK.*
