# Grupo PEPEK Rent-a-Car — Guia Rápido de Utilização e Exploração

> **Guia Executivo de Navegação, Demonstração e Operações**  
> Aplicação Web: [grupopedek-one.vercel.app](https://grupopedek-one.vercel.app)  
> Versão da Frota: 2026 (47 Viaturas Oficiais) · Idiomas: PT / EN / FR

---

## 🚗 1. Exploração da Frota Oficial (47 Viaturas)

Aceda a **Serviços** ou **Frota** na barra de navegação superior:

1. **Vitrine Automática & Pausa Interativa:**
   - A vitrine percorre automaticamente a frota oficial de 47 viaturas.
   - Passe o cursor sobre qualquer cartão para pausar o carrossel.
2. **Galeria Fotográfica e Especificações:**
   - Clique em **"Ver Galeria / Detalhes"** para inspecionar fotos reais em alta resolução (exterior, traseira, interior), capacidade de passageiros, bagagem, tipo de combustível e transmissão.
3. **Filtros por Categoria:**
   - Filtre instantaneamente por **Executivo VIP**, **SUV / 4x4**, **Vans & Minibus**, **Pick-up Trabalho** ou **Económico**.

---

## 📝 2. Fluxo de Reserva e Simulação de Cotação

Aceda a **Reservar** ou clique em **"Solicitar esta Viatura"** num cartão de frota:

1. **Seleção da Viatura:** O modelo selecionado é automaticamente carregado.
2. **Configuração do Serviço:**
   - Escolha o tipo de serviço (*Rent-a-Car*, *Chauffeur / Apoio Executivo*, *Transfer VIP* ou *Gestão de Frota*).
   - Defina com ou sem motorista protocolar bilingue.
3. **Datas e Itinerário:** Indique as datas de início/fim e província (Luanda, Huambo, Bengo ou outras).
4. **Emissão de Protocolo:**
   - Ao submeter o formulário, é gerado um código de protocolo demonstrativo.
   - Pode clicar em **"Continuar para Portal & Fatura Demo"** para testar a experiência do cliente.

---

## 👤 3. Área de Cliente & Os 9 Perfis Demonstrativos

Aceda a **Portal do Cliente** (ou Área Cliente):

| Perfil | Finalidade na Demonstração | O que explorar |
|---|---|---|
| **Cliente VIP Diplomático** (`vip.demo`) | Gestão executiva de topo | Viaturas atribuídas, faturas em aberto e requisições prioritárias |
| **Cliente PME / Normal** (`cliente.demo`) | Gestão corrente de empresa | Lista de viaturas ativas, histórico de faturas e novos pedidos |
| **Vendedor CRM** (`vendedor.demo`) | Visão comercial | Frota global e encaminhamento de propostas (sem finanças) |
| **Gestor de Reservas** (`reservas.demo`) | Despacho operacional | Frota global, alocações e status de reservas |
| **Director de Frotas** (`frotas.demo`) | Manutenção e telemetria | KM, combustível, estado operacional e alertas de oficina |
| **Motorista Protocolar** (`motorista.demo`) | Execução de campo | Escalas e viaturas atribuídas (sem dados financeiros) |
| **Contabilista AGT** (`contabilidade.demo`)| Finanças e fiscalidade | Faturas, liquidações e conformidade AGT |
| **Gestor Portugal** (`portugal.demo`) | Gestão internacional | Liquidações em Euros (€) via MB WAY e Stripe |
| **Direcção Executiva** (`direcao.demo`) | Visão panorâmica | Dashboard consolidado: frota, operações e finanças |

---

## 💳 4. Simulação de Pagamentos Multirregionais

Na Área de Cliente (em qualquer perfil com permissões financeiras):

1. Aceda à aba **"Minhas Faturas & Recibos"**.
2. Identifique uma fatura com estado **Pendente** e clique em **"Pagar Agora"**.
3. Escolha a modalidade de acordo com a região:
   - 🇦🇴 **Angola:** Multicaixa Express (MCX) ou BAI Direto.
   - 🇵🇹 **Portugal / Europa:** MB WAY ou Transferência SEPA.
   - 🌍 **Internacional:** Cartão de Crédito via Stripe.
4. Clique em **"Simular Pagamento"**:
   - O recibo demonstrativo é emitido instantaneamente.
   - A fatura transita para **Liquidada** e o botão de pagamento é desativado.

---

## 💬 5. Chatbot e Assistente IA

O assistente virtual está integrado no canto inferior direito do ecrã para apoio em tempo real:

- **Perguntas que pode testar:**
  - *"Quantos carros têm na vossa frota?"* → Confirmação oficial das 47 viaturas.
  - *"Como posso pagar em Angola?"* → Informação de Multicaixa Express e BAI Direto.
  - *"Têm operação no Huambo?"* → Confirmação do pólo Planalto Central com frota 4x4.
  - *"Qual a política de motoristas?"* → Pilotos de protocolo bilingues e condução defensiva.
- **Guardrails de Segurança Integrados:**
  - O assistente não inventa viaturas fora das 47 da base oficial.
  - O assistente nunca expõe credenciais ou senhas no chat.

---

## 📞 6. Contactos e Suporte 24/7

- **Sede Operacional:** Luanda (Talatona & Aeroporto 4 de Fevereiro)
- **Pólos Regionais:** Huambo (Planalto Central) e Bengo (Corredor Norte)
- **E-mail Geral:** `geral@pepekgrupo.com`
- **Atendimento Operacional:** 24 horas por dia, 365 dias por ano.
