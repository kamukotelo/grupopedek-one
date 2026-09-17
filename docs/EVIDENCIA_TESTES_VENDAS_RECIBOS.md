# Relatório de Testes de Vendas e Evidência de Recibos
**Data de Execução:** 17/09/2026 às 15:47:35  
**Entidade Emissora:** PEPEK GRUPO RENT-A-CAR S.A. (NIF: 5417088491)  
**Certificação de Software:** Software Certificado n.º 284/AGT/2026  
**Resultado dos Testes:** ✅ 46 verificações com sucesso (0 falhas)

---

## 1. Resumo Executivo dos Modelos de Pagamento Testados

Foram executados testes de ponta a ponta para todos os modelos de pagamento disponíveis no sistema PEPEK, cobrindo o ciclo completo:
1. Emissão de Fatura Comercial (conforme normas da Administração Geral Tributária - AGT de Angola).
2. Registo de Ordem de Pagamento no livro-razão protegido do servidor (`payment_orders`).
3. Validação de idempotência e imutabilidade de montante.
4. Processamento da transação pelo gateway com verificação de assinatura / autorização.
5. Auditoria em trilha append-only (`payment_events`).
6. Emissão de Recibo Oficial de Quitação com assinatura criptográfica SHA-256 (`payment_receipts`).

| Modelo de Pagamento | Canal / Rede | Moeda | Caso de Venda | N.º Fatura | N.º Recibo | Hash Integridade SHA-256 |
|---|---|---|---|---|---|---|
| **Multicaixa Express** | MULTICAIXA | AOA | Aluguer Mensal Executivo Toyot... | `FT-PEPEK-2026/4498` | `REC-2026-EE020ED02B39` | `dd1cd9608c556834...` |
| **Cartão / Stripe** | STRIPE | USD | Transfer VIP Aeroporto Interna... | `FT-PEPEK-2026/6750` | `REC-2026-28CD2E04AA28` | `2a62dda7e50ef149...` |
| **Transferência Bancária** | BANK_TRANSFER | AOA | Contrato Mensal de Mobilidade ... | `FT-PEPEK-2026/8270` | `REC-2026-19C6D2BDEAAF` | `b71353668802bf82...` |
| **MB WAY** | MBWAY | EUR | Aluguer Semanal Mercedes-Benz ... | `FT-PEPEK-2026/9494` | `REC-2026-FB65F1F2A157` | `7a8427a8dc74ae6c...` |

---

## 2. Evidências Detalhadas dos Recibos Emitidos


### Evidência 1: Recibo REC-2026-EE020ED02B39 (Multicaixa Express)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Software Certificado n.º 284/AGT/2026
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
RECIBO DE QUITAÇÃO FISCAL: REC-2026-EE020ED02B39
Fatura Liquidada          : FT-PEPEK-2026/4498
Data e Hora de Liquidação : 2026-09-17T14:47:35.306Z
Referência de Pagamento   : PK-PAY-2026-48E8DC7CEACB

DADOS DO CLIENTE:
Nome    : Embaixada Parceira de Luanda / Corpo Diplomático
NIF     : 5412345678

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Aluguer Mensal Executivo Toyota Land Cruiser 300 VXR com Motorista Protocolar
Frota     : LD-42-88-GG

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : Multicaixa Express
Comprovativo Provedor  : EMIS-MCX-1789656455306-1F31796C
Evento de Auditoria    : emis.multicaixa.settled

DISCRIMINAÇÃO FINANCEIRA E TRIBUTÁRIA:
Incidência Líquida     : 4 200 000,00 (Base Tributável)
Taxa IVA               : 14% (Regime Geral AGT)
Imposto IVA Liquidado  : 515 789,47 AOA
TOTAL PAGO / LIQUIDADO : 4 200 000,00 AOA

ASSINATURA DIGITAL / INTEGRITY HASH (SHA-256):
dd1cd9608c55683476422cfd526218b1a521376894ceecb2221adf96709f38da
(Garantia de autenticidade, não-repúdio e imutabilidade conforme padrão AGT)
================================================================================
```


### Evidência 2: Recibo REC-2026-28CD2E04AA28 (Cartão / Stripe)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Software Certificado n.º 284/AGT/2026
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
RECIBO DE QUITAÇÃO FISCAL: REC-2026-28CD2E04AA28
Fatura Liquidada          : FT-PEPEK-2026/6750
Data e Hora de Liquidação : 2026-09-17T14:47:35.307Z
Referência de Pagamento   : PK-PAY-2026-3573CFB361F4

DADOS DO CLIENTE:
Nome    : Global Energy Consult Ltd (UK / Staging)
NIF     : GB987654321

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Transfer VIP Aeroporto Internacional AIAAN + Escolta Huambo (Mercedes V300 Executivo)
Frota     : LD-99-10-EE

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : Cartão / Stripe
Comprovativo Provedor  : pi_test_3dd065c9682fe9a73438ecd93710d6b6
Evento de Auditoria    : stripe.checkout.session.completed

DISCRIMINAÇÃO FINANCEIRA E TRIBUTÁRIA:
Incidência Líquida     : $2,050.00 (Base Tributável)
Taxa IVA               : 14% (Regime Geral AGT)
Imposto IVA Liquidado  : $251.75 USD
TOTAL PAGO / LIQUIDADO : $2,050.00 USD

ASSINATURA DIGITAL / INTEGRITY HASH (SHA-256):
2a62dda7e50ef149ce5d2ada9e58e4a219c18f6f1699e73cd5071145c0d1f9f0
(Garantia de autenticidade, não-repúdio e imutabilidade conforme padrão AGT)
================================================================================
```


### Evidência 3: Recibo REC-2026-19C6D2BDEAAF (Transferência Bancária)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Software Certificado n.º 284/AGT/2026
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
RECIBO DE QUITAÇÃO FISCAL: REC-2026-19C6D2BDEAAF
Fatura Liquidada          : FT-PEPEK-2026/8270
Data e Hora de Liquidação : 2026-09-17T14:47:35.309Z
Referência de Pagamento   : PK-PAY-2026-FAC415206C72

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

DISCRIMINAÇÃO FINANCEIRA E TRIBUTÁRIA:
Incidência Líquida     : 7 850 000,00 (Base Tributável)
Taxa IVA               : 14% (Regime Geral AGT)
Imposto IVA Liquidado  : 964 035,09 AOA
TOTAL PAGO / LIQUIDADO : 7 850 000,00 AOA

ASSINATURA DIGITAL / INTEGRITY HASH (SHA-256):
b71353668802bf824557bd8c3979a440ccd6d21f71594b0dd9cf092551b1d68b
(Garantia de autenticidade, não-repúdio e imutabilidade conforme padrão AGT)
================================================================================
```


### Evidência 4: Recibo REC-2026-FB65F1F2A157 (MB WAY)

```text
================================================================================
                    PEPEK GRUPO RENT-A-CAR S.A.
        NIF: 5417088491 · Software Certificado n.º 284/AGT/2026
        Complexo Talatona Park, Luanda · financas@pepekgrupo.com
================================================================================
RECIBO DE QUITAÇÃO FISCAL: REC-2026-FB65F1F2A157
Fatura Liquidada          : FT-PEPEK-2026/9494
Data e Hora de Liquidação : 2026-09-17T14:47:35.309Z
Referência de Pagamento   : PK-PAY-2026-8379E5FF7386

DADOS DO CLIENTE:
Nome    : Eng. António Silva (Missão Técnica Lisboa-Luanda)
NIF     : PT234567890

DETALHES DO SERVIÇO / PRODUTO:
Descrição : Aluguer Semanal Mercedes-Benz V-Class V300 VIP com Conectividade Satélite
Frota     : LD-77-33-VV

MEIO DE PAGAMENTO E AUDITORIA:
Provedor / Gateway     : MB WAY
Comprovativo Provedor  : MBW-PT-MU5N8UPF-EAFE19
Evento de Auditoria    : mbway.notification.authorized

DISCRIMINAÇÃO FINANCEIRA E TRIBUTÁRIA:
Incidência Líquida     : €950,00 (Base Tributável)
Taxa IVA               : 14% (Regime Geral AGT)
Imposto IVA Liquidado  : €116,67 EUR
TOTAL PAGO / LIQUIDADO : €950,00 EUR

ASSINATURA DIGITAL / INTEGRITY HASH (SHA-256):
7a8427a8dc74ae6c3c7c79e3b5bac9ba94f9bda8e33b5b91be8793cd6f65bb47
(Garantia de autenticidade, não-repúdio e imutabilidade conforme padrão AGT)
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
