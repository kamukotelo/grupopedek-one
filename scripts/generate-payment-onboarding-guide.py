#!/usr/bin/env python3
"""Generate PEPEK's payment onboarding guide as a polished A4 PDF."""

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    Flowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfgen.canvas import Canvas
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "GUIA-ATIVACAO-PAGAMENTOS-PEPEK-2026.pdf"
LOGO_LIGHT = ROOT / "public" / "Logos" / "Positivo.png"
LOGO_DARK = ROOT / "public" / "logo-pepek-dark.png"

NAVY = colors.HexColor("#001E4A")
NAVY_2 = colors.HexColor("#082B5D")
BLUE = colors.HexColor("#195A96")
MID_BLUE = colors.HexColor("#2B6DA9")
YELLOW = colors.HexColor("#FFBF22")
PALE_YELLOW = colors.HexColor("#FFF4CE")
PALE_BLUE = colors.HexColor("#EAF2FA")
ICE = colors.HexColor("#F5F8FC")
TEXT = colors.HexColor("#12233D")
MUTED = colors.HexColor("#596B85")
GREEN = colors.HexColor("#159A67")
RED = colors.HexColor("#B83A3A")
LINE = colors.HexColor("#D5DFEB")
WHITE = colors.white

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X


class SquareBox(Flowable):
    def __init__(self, checked=False, size=8):
        super().__init__()
        self.checked = checked
        self.size = size
        self.width = size
        self.height = size

    def draw(self):
        self.canv.setStrokeColor(MID_BLUE)
        self.canv.setLineWidth(1)
        self.canv.roundRect(0, 0, self.size, self.size, 1.5, stroke=1, fill=0)
        if self.checked:
            self.canv.setStrokeColor(GREEN)
            self.canv.setLineWidth(1.5)
            self.canv.line(1.5, self.size * 0.45, self.size * 0.4, 1.5)
            self.canv.line(self.size * 0.4, 1.5, self.size - 1, self.size - 1.5)


class StatusDot(Flowable):
    def __init__(self, fill, size=7):
        super().__init__()
        self.fill = fill
        self.width = size
        self.height = size
        self.size = size

    def draw(self):
        self.canv.setFillColor(self.fill)
        self.canv.circle(self.size / 2, self.size / 2, self.size / 2, stroke=0, fill=1)


class MiniFlow(Flowable):
    def __init__(self, labels, width=CONTENT_W, height=46 * mm):
        super().__init__()
        self.labels = labels
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        gap = 8
        n = len(self.labels)
        box_w = (self.width - gap * (n - 1)) / n
        box_h = 25 * mm
        y = 8 * mm
        for i, (step, title, sub) in enumerate(self.labels):
            x = i * (box_w + gap)
            c.setFillColor(NAVY if i in (0, n - 1) else PALE_BLUE)
            c.setStrokeColor(YELLOW if i in (0, n - 1) else LINE)
            c.roundRect(x, y, box_w, box_h, 7, stroke=1, fill=1)
            c.setFillColor(YELLOW if i in (0, n - 1) else BLUE)
            c.setFont("Helvetica-Bold", 7.5)
            c.drawString(x + 7, y + box_h - 11, step)
            c.setFillColor(WHITE if i in (0, n - 1) else TEXT)
            c.setFont("Helvetica-Bold", 8.5)
            c.drawString(x + 7, y + box_h - 23, title)
            c.setFillColor(colors.HexColor("#C6D4E7") if i in (0, n - 1) else MUTED)
            c.setFont("Helvetica", 6.5)
            words = sub.split()
            lines, line = [], ""
            for word in words:
                trial = (line + " " + word).strip()
                if stringWidth(trial, "Helvetica", 6.5) < box_w - 14:
                    line = trial
                else:
                    lines.append(line)
                    line = word
            if line:
                lines.append(line)
            for j, txt in enumerate(lines[:3]):
                c.drawString(x + 7, y + box_h - 34 - j * 8, txt)
            if i < n - 1:
                ax = x + box_w + 1
                ay = y + box_h / 2
                c.setStrokeColor(YELLOW)
                c.setFillColor(YELLOW)
                c.setLineWidth(1.2)
                c.line(ax, ay, ax + gap - 3, ay)
                c.line(ax + gap - 6, ay + 2.5, ax + gap - 3, ay)
                c.line(ax + gap - 6, ay - 2.5, ax + gap - 3, ay)


class Timeline(Flowable):
    def __init__(self, steps, width=CONTENT_W):
        super().__init__()
        self.steps = steps
        self.width = width
        self.row_h = 31
        self.height = len(steps) * self.row_h

    def draw(self):
        c = self.canv
        x_line = 16
        c.setStrokeColor(LINE)
        c.setLineWidth(2)
        c.line(x_line, 12, x_line, self.height - 12)
        for i, (title, detail, owner) in enumerate(self.steps):
            y = self.height - (i + 0.5) * self.row_h
            c.setFillColor(YELLOW if i < 3 else MID_BLUE)
            c.circle(x_line, y, 7, stroke=0, fill=1)
            c.setFillColor(NAVY if i < 3 else WHITE)
            c.setFont("Helvetica-Bold", 7)
            c.drawCentredString(x_line, y - 2.4, str(i + 1))
            c.setFillColor(TEXT)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(34, y + 3, title)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7.2)
            c.drawString(34, y - 8, detail)
            c.setFillColor(PALE_BLUE)
            c.roundRect(self.width - 88, y - 9, 84, 18, 8, stroke=0, fill=1)
            c.setFillColor(BLUE)
            c.setFont("Helvetica-Bold", 6.6)
            c.drawCentredString(self.width - 46, y - 2, owner.upper())


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=7.5, leading=10, textColor=BLUE, tracking=1.5, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="H1X", parent=styles["Heading1"], fontName="Helvetica-Bold",
    fontSize=21, leading=24, textColor=NAVY, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="H2X", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=14, leading=17, textColor=NAVY, spaceBefore=4, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="H3X", parent=styles["Heading3"], fontName="Helvetica-Bold",
    fontSize=9.5, leading=12, textColor=NAVY, spaceBefore=2, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="BodyX", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=8.3, leading=12.2, textColor=TEXT, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="BodySmall", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=7.2, leading=10.2, textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="WhiteBody", parent=styles["BodyText"], fontName="Helvetica",
    fontSize=8, leading=11.5, textColor=WHITE,
))
styles.add(ParagraphStyle(
    name="WhiteHead", parent=styles["Heading2"], fontName="Helvetica-Bold",
    fontSize=13, leading=16, textColor=WHITE, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="CardTitle", parent=styles["Heading3"], fontName="Helvetica-Bold",
    fontSize=8.5, leading=10.5, textColor=NAVY, spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="TableHead", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=7, leading=8.5, textColor=WHITE,
))
styles.add(ParagraphStyle(
    name="TableBody", parent=styles["Normal"], fontName="Helvetica",
    fontSize=6.8, leading=9.2, textColor=TEXT,
))
styles.add(ParagraphStyle(
    name="TableBodyBold", parent=styles["TableBody"], fontName="Helvetica-Bold",
))
styles.add(ParagraphStyle(
    name="Source", parent=styles["Normal"], fontName="Helvetica",
    fontSize=7.2, leading=10.5, textColor=MUTED, spaceAfter=6,
))


def P(text, style="BodyX"):
    return Paragraph(text, styles[style])


def section_title(kicker, title, subtitle=None):
    out = [P(kicker.upper(), "Eyebrow"), P(title, "H1X")]
    if subtitle:
        out.append(P(subtitle, "BodySmall"))
        out.append(Spacer(1, 4 * mm))
    else:
        out.append(Spacer(1, 2 * mm))
    return out


def card(title, body, accent=YELLOW, width=None):
    inner = [P(title, "CardTitle"), P(body, "BodySmall")]
    safe_width = width or (CONTENT_W - 20) / 2
    t = Table([[inner]], colWidths=[safe_width])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ICE),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("LINEABOVE", (0, 0), (-1, 0), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def checklist(items, columns=1):
    if columns == 2:
        half = (len(items) + 1) // 2
        left, right = items[:half], items[half:]
        rows = []
        for i in range(max(len(left), len(right))):
            row = []
            for group in (left, right):
                if i < len(group):
                    row.extend([SquareBox(), P(group[i], "TableBody")])
                else:
                    row.extend(["", ""])
            rows.append(row)
        widths = [12, CONTENT_W / 2 - 17, 12, CONTENT_W / 2 - 17]
    else:
        rows = [[SquareBox(), P(item, "TableBody")] for item in items]
        widths = [12, CONTENT_W - 12]
    t = Table(rows, colWidths=widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t


def data_table(headers, rows, widths, font_size=6.8):
    data = [[P(h, "TableHead") for h in headers]]
    for row in rows:
        data.append([P(str(v), "TableBodyBold" if i == 0 else "TableBody") for i, v in enumerate(row)])
    t = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    body_style = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, ICE]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    t.setStyle(TableStyle(body_style))
    return t


def callout(title, body, kind="info"):
    palette = {
        "info": (PALE_BLUE, BLUE),
        "warn": (PALE_YELLOW, colors.HexColor("#AD7400")),
        "risk": (colors.HexColor("#FCE9E8"), RED),
        "success": (colors.HexColor("#E6F6EF"), GREEN),
    }
    bg, accent = palette[kind]
    t = Table([[StatusDot(accent), [P(title, "CardTitle"), P(body, "BodySmall")]]], colWidths=[24, CONTENT_W - 24])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.5, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def split_cards(cards, cols=2, gap=6):
    width = (CONTENT_W - gap * (cols - 1)) / cols
    rows = []
    for i in range(0, len(cards), cols):
        row = cards[i:i + cols]
        while len(row) < cols:
            row.append("")
        rows.append(row)
    t = Table(rows, colWidths=[width] * cols, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), gap),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), gap),
    ]))
    return t


def page_decor(canvas: Canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        canvas.setFillColor(NAVY_2)
        canvas.circle(PAGE_W * 0.92, PAGE_H * 0.77, 95 * mm, stroke=0, fill=1)
        canvas.setStrokeColor(YELLOW)
        canvas.setLineWidth(1.2)
        for offset in (0, 8, 16):
            canvas.roundRect(18 * mm + offset, 22 * mm + offset, PAGE_W - 44 * mm, 42 * mm, 10, stroke=1, fill=0)
    else:
        canvas.setFillColor(WHITE)
        canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_H - 18 * mm, PAGE_W, 18 * mm, stroke=0, fill=1)
        if LOGO_LIGHT.exists():
            canvas.drawImage(str(LOGO_LIGHT), MARGIN_X, PAGE_H - 14 * mm, width=35 * mm, height=11.7 * mm, mask="auto", preserveAspectRatio=True)
        canvas.setFillColor(colors.HexColor("#AFC1D7"))
        canvas.setFont("Helvetica", 6.8)
        canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 10.5 * mm, "GUIA DE ATIVACAO DE PAGAMENTOS DIGITAIS")
        canvas.setStrokeColor(LINE)
        canvas.line(MARGIN_X, 13 * mm, PAGE_W - MARGIN_X, 13 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 6.5)
        canvas.drawString(MARGIN_X, 8 * mm, "PEPEK GRUPO RENT-A-CAR | Documento de trabalho | Luanda, Angola")
        canvas.drawRightString(PAGE_W - MARGIN_X, 8 * mm, f"Pagina {doc.page} de 10")
    canvas.restoreState()


def cover_story():
    story = [Spacer(1, 17 * mm)]
    if LOGO_LIGHT.exists():
        story.append(Image(str(LOGO_LIGHT), width=76 * mm, height=25.3 * mm, kind="proportional"))
    story.extend([
        Spacer(1, 30 * mm),
        P("PAGAMENTOS DIGITAIS 2026", "Eyebrow"),
        Paragraph("Guia de preparação e<br/>ativação de pagamentos", ParagraphStyle(
            "CoverTitle", fontName="Helvetica-Bold", fontSize=29, leading=33,
            textColor=WHITE, spaceAfter=8,
        )),
        Paragraph("EMIS / MULTICAIXA EXPRESS + VISA", ParagraphStyle(
            "CoverSub", fontName="Helvetica-Bold", fontSize=13, leading=17,
            textColor=YELLOW, tracking=0.7, spaceAfter=12,
        )),
        Paragraph(
            "Um roteiro completo para reunir documentos, contratar adquirentes, integrar o site, homologar transações e operar pagamentos com segurança.",
            ParagraphStyle("CoverBody", fontName="Helvetica", fontSize=11, leading=16,
                           textColor=colors.HexColor("#D7E2F0"), spaceAfter=12),
        ),
        Spacer(1, 27 * mm),
        Table([
            [P("FOCO INICIAL", "TableHead"), P("RESULTADO ESPERADO", "TableHead"), P("RESPONSAVEIS", "TableHead")],
            [P("EMIS nacional + Visa internacional", "WhiteBody"),
             P("Pagamento, confirmação, reconciliação e recibo", "WhiteBody"),
             P("Cliente + banco/PSP + engenharia + financeiro", "WhiteBody")],
        ], colWidths=[CONTENT_W * 0.28, CONTENT_W * 0.40, CONTENT_W * 0.32], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BLUE),
            ("BACKGROUND", (0, 1), (-1, 1), NAVY_2),
            ("BOX", (0, 0), (-1, -1), 0.8, YELLOW),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#32547C")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ])),
        Spacer(1, 10 * mm),
        Paragraph("Preparado em 10 de setembro de 2026", ParagraphStyle(
            "CoverMeta", fontName="Helvetica", fontSize=8, textColor=colors.HexColor("#AFC1D7")
        )),
        Paragraph("Versão 1.0 | Confidencial - para validação comercial e técnica", ParagraphStyle(
            "CoverMeta2", fontName="Helvetica", fontSize=8, leading=12, textColor=colors.HexColor("#AFC1D7")
        )),
    ])
    return story


def build_story():
    s = cover_story()

    # 2. Executive view
    s += [PageBreak()]
    s += section_title("01 | Visão executiva", "O que precisa acontecer", "O site só deve receber dinheiro real depois de contrato, credenciais, homologação e reconciliação comprovada.")
    s.append(split_cards([
        card("Estado atual do site", "Quatro métodos previstos: Multicaixa Express, cartão/Stripe, transferência bancária e MB WAY. O livro-razão e os controlos de autenticação já existem."),
        card("Principal bloqueio", "EMIS, transferência e MB WAY ainda aguardam contratos e credenciais oficiais. Sem esses elementos, o sistema apenas cria uma ordem pendente."),
        card("Prioridade recomendada", "1) EMIS/GPO para pagamentos nacionais em AOA. 2) Visa através de banco adquirente ou PSP elegível. 3) Transferência e MB WAY."),
        card("Regra de segurança", "Número completo do cartão, CVV e PIN nunca entram no site nem na base de dados. O pagamento é realizado numa página hospedada pelo provedor."),
    ], cols=2))
    s.append(Spacer(1, 3 * mm))
    s.append(P("FLUXO DE PONTA A PONTA", "Eyebrow"))
    s.append(MiniFlow([
        ("1. PEDIDO", "Cliente", "Seleciona reserva ou fatura e escolhe o método."),
        ("2. ORDEM", "Site PEPEK", "Valida sessão, valor, moeda e referência única."),
        ("3. AUTORIZA", "EMIS / PSP", "Processa o pagamento e autentica o pagador."),
        ("4. LIQUIDA", "Banco", "Credita a conta comercial segundo o contrato."),
        ("5. CONFIRMA", "Financeiro", "Concilia o evento, atualiza a fatura e emite recibo."),
    ]))
    s.append(callout("Ponto de decisão", "Visa é a bandeira do cartão, não o gateway. A PEPEK precisa de um banco adquirente ou PSP que ofereça uma conta de comerciante e processamento Visa para comércio eletrónico.", "warn"))

    # 3. Roadmap
    s += [PageBreak()]
    s += section_title("02 | Roteiro", "Da decisão à produção", "A ordem reduz retrabalho: primeiro contrato e regras comerciais, depois integração, homologação e ativação gradual.")
    s.append(Timeline([
        ("Definir o modelo de cobrança", "Sinal, valor total, caução, moedas, cancelamento, no-show e reembolso.", "Direção + Financeiro"),
        ("Reunir o pacote institucional", "Documentos da empresa, representantes, beneficiários e contas bancárias.", "Cliente"),
        ("Contratar os canais", "EMIS/GPO com banco de apoio e Visa com adquirente ou PSP elegível.", "Cliente + Banco"),
        ("Receber o pacote técnico", "Merchant IDs, ambientes, documentação, certificados, segredos e contactos.", "Banco / PSP"),
        ("Integrar no staging", "Criar pagamentos, validar callbacks, expiração, anulação e reembolso.", "Engenharia"),
        ("Homologar", "Executar cenários aprovados e obter autorização formal para produção.", "Todos"),
        ("Ativar e monitorizar", "Liberar por canal, reconciliar diariamente e acompanhar falhas e chargebacks.", "Financeiro + TI"),
    ]))
    s.append(Spacer(1, 4 * mm))
    s.append(data_table(
        ["FASE", "ENTRADA", "SAIDA / CRITERIO DE ACEITACAO"],
        [
            ("Comercial", "Regras e moedas aprovadas", "Tabela de cobrança e políticas publicadas"),
            ("Contratual", "KYC e contas bancárias", "Contrato EMIS/PSP assinado e Merchant ID emitido"),
            ("Técnica", "Credenciais de teste", "Checkout, webhook, consulta e reembolso funcionais"),
            ("Homologação", "Plano de testes", "Evidências aceites pelo banco/PSP"),
            ("Produção", "Credenciais live", "Transação real de baixo valor reconciliada"),
        ],
        [31 * mm, 58 * mm, CONTENT_W - 89 * mm],
    ))
    s.append(Spacer(1, 4 * mm))
    s.append(callout("Não antecipar credenciais", "O cliente entrega primeiro os dados jurídicos e bancários. O banco ou PSP entrega as credenciais técnicas somente após aprovação comercial e contratual.", "info"))

    # 4. Institutional pack
    s += [PageBreak()]
    s += section_title("03 | Dados do cliente", "Pacote institucional e bancário", "Checklist para o representante legal preparar antes de solicitar EMIS/GPO ou Visa.")
    s.append(P("IDENTIFICAÇÃO E KYC DA EMPRESA", "H2X"))
    s.append(checklist([
        "Nome legal completo e nome comercial.",
        "NIF e certidão do Registo Comercial atualizada.",
        "Estatutos ou pacto social.",
        "Alvará ou licença da atividade de rent-a-car.",
        "Endereço completo e comprovativo da sede.",
        "Telefone, e-mail institucional e domínio oficial.",
        "Identificação de sócios e beneficiários efetivos.",
        "Documento do representante legal e procuração, se aplicável.",
        "Descrição da atividade, público-alvo e países atendidos.",
        "Estimativa de volume mensal, valor médio e maior transação.",
    ], columns=2))
    s.append(Spacer(1, 4 * mm))
    s.append(P("CONTAS PARA LIQUIDAÇÃO", "H2X"))
    s.append(data_table(
        ["CAMPO", "AOA / EMIS", "USD / VISA", "EUR / VISA OU MB WAY"],
        [
            ("Banco e titular", "A confirmar", "A confirmar", "A confirmar"),
            ("Conta / IBAN", "A confirmar", "A confirmar", "A confirmar"),
            ("SWIFT / BIC", "Se aplicável", "Obrigatório para internacional", "Conforme o PSP"),
            ("Comprovativo", "Documento bancário", "Documento bancário", "Documento bancário"),
            ("Liquidação", "Prazo e comissão", "Prazo, comissão e FX", "Prazo, comissão e FX"),
            ("Responsável", "Nome + e-mail", "Nome + e-mail", "Nome + e-mail"),
        ],
        [38 * mm, 42 * mm, 52 * mm, CONTENT_W - 132 * mm],
    ))
    s.append(Spacer(1, 4 * mm))
    s.append(callout("Como partilhar", "Documentos podem ser entregues numa pasta restrita. Segredos, certificados e chaves privadas devem ser introduzidos diretamente no cofre de segredos da infraestrutura, nunca por WhatsApp ou em documentos públicos.", "risk"))

    # 5. EMIS
    s += [PageBreak()]
    s += section_title("04 | Canal nacional", "EMIS / MULTICAIXA Express", "Objetivo: permitir pagamentos online em AOA e receber confirmação automática e auditável.")
    s.append(split_cards([
        card("Quem contrata", "A PEPEK, através do banco comercial onde está domiciliada a conta de liquidação."),
        card("O que solicitar", "Gateway de Pagamentos Online (GPO/TPA virtual), MULTICAIXA Express online e, se necessário, pagamentos por referência."),
        card("Quem fornece a integração", "O banco de apoio e/ou a EMIS, conforme o modelo comercial contratado."),
        card("Quando ativar", "Depois de homologação, credenciais de produção e teste real reconciliado com o extrato bancário."),
    ], cols=2))
    s.append(P("PACOTE QUE O BANCO / EMIS DEVE ENTREGAR", "H2X"))
    s.append(checklist([
        "Contrato de comerciante aprovado e tabela de comissões.",
        "Merchant ID e identificador de terminal/TPA virtual, conforme o produto.",
        "Identificadores de entidade ou serviço, quando aplicável.",
        "Documentação técnica e URLs dos ambientes de teste e produção.",
        "Credenciais, certificados ou chaves de assinatura.",
        "Lista de IPs, requisitos de TLS e política de rotação de segredos.",
        "Formato de callback/webhook e mecanismo de validação da assinatura.",
        "Operações disponíveis: criar, consultar, cancelar, devolver e reembolsar.",
        "Prazo de expiração, limites mínimos/máximos e estados possíveis.",
        "Dados e casos de teste, procedimento de homologação e contactos de suporte.",
        "Calendário de liquidação, ficheiro/relatório de reconciliação e SLA.",
        "Manual de utilização das marcas MULTICAIXA e MULTICAIXA Express.",
    ], columns=2))
    s.append(Spacer(1, 3 * mm))
    s.append(callout("Regra operacional", "Sem confirmação autenticada do provedor ou reconciliação bancária autorizada, a ordem permanece PENDENTE e a fatura não pode ser marcada como paga.", "success"))

    # 6. Visa
    s += [PageBreak()]
    s += section_title("05 | Cartões internacionais", "Visa através de adquirente ou PSP", "Objetivo: aceitar cartões de clientes internacionais com 3-D Secure, antifraude, chargebacks e reembolsos controlados.")
    s.append(callout("Decisão crítica antes da integração", "A empresa deve escolher o adquirente/PSP e confirmar que a entidade jurídica, o país e a conta bancária são elegíveis. Angola não consta atualmente da disponibilidade direta da Stripe para contas de comerciante.", "warn"))
    s.append(Spacer(1, 4 * mm))
    s.append(data_table(
        ["OPÇÃO", "QUANDO FAZ SENTIDO", "VALIDAÇÃO OBRIGATÓRIA"],
        [
            ("Banco adquirente angolano", "Entidade e liquidação principal em Angola", "Visa e e-commerce ativados; moedas e 3-D Secure confirmados"),
            ("Visa Acceptance Solutions / parceiro", "Operação internacional com parceiro adquirente", "Contrato, país, Merchant ID, settlement e suporte local"),
            ("Outro PSP autorizado", "PSP aceita legalmente a entidade PEPEK", "Elegibilidade, taxas, chargebacks e moedas documentados"),
            ("Stripe", "Somente com entidade e conta em país suportado", "Não usar morada, entidade ou conta fictícia"),
        ],
        [39 * mm, 64 * mm, CONTENT_W - 103 * mm],
    ))
    s.append(Spacer(1, 4 * mm))
    s.append(P("DADOS E CREDENCIAIS A RECEBER", "H2X"))
    s.append(checklist([
        "Contrato Visa e conta de comerciante para card-not-present/e-commerce.",
        "Merchant ID, terminal/perfil e descriptor do extrato.",
        "Moedas de cobrança, moeda de liquidação, comissões e conversão cambial.",
        "Chaves de API, segredo do webhook e ambientes de teste/produção.",
        "Visa Secure / EMV 3-D Secure e regras de autenticação.",
        "Ferramentas antifraude e responsabilidades por revisão manual.",
        "Prazos de captura, cancelamento, reembolso e chargeback.",
        "Cartões e cenários oficiais de teste.",
        "Contactos técnico, financeiro, antifraude e contestações.",
        "Confirmação do questionário PCI DSS aplicável.",
    ], columns=2))

    # 7. Business decisions
    s += [PageBreak()]
    s += section_title("06 | Regras do negócio", "Decisões antes de programar", "A integração não pode decidir sozinha quanto cobrar, quando devolver ou como tratar cauções.")
    s.append(data_table(
        ["DECISÃO", "PERGUNTA QUE A DIREÇÃO DEVE RESPONDER", "SAÍDA"],
        [
            ("Momento da cobrança", "Na reserva, confirmação, levantamento ou devolução?", "Regra por serviço"),
            ("Montante", "100%, sinal, caução ou combinação?", "Tabela de percentagens"),
            ("Caução", "Pré-autorização ou cobrança? Prazo de libertação?", "Política de caução"),
            ("Moedas", "AOA, USD e EUR? Quem suporta o câmbio?", "Matriz de moeda/conta"),
            ("Taxa de câmbio", "Qual a fonte, vigência e responsável?", "Procedimento cambial"),
            ("Cancelamento", "Qual o prazo e a penalização?", "Política publicada"),
            ("No-show", "Quando e quanto reter?", "Cláusula contratual"),
            ("Reembolso", "Total/parcial, aprovador e prazo?", "Fluxo de aprovação"),
            ("Danos/extras", "Como obter autorização e evidência?", "Procedimento documentado"),
            ("Corporativo", "Crédito a 30/60 dias ou pagamento imediato?", "Regra por perfil"),
        ],
        [34 * mm, 90 * mm, CONTENT_W - 124 * mm],
    ))
    s.append(Spacer(1, 4 * mm))
    s.append(P("PÁGINAS E INFORMAÇÕES OBRIGATÓRIAS NO SITE", "H2X"))
    s.append(checklist([
        "Termos e condições e condições gerais de aluguer.",
        "Política de privacidade e retenção.",
        "Política de cancelamento, no-show e reembolso.",
        "Regras de caução, danos, combustível, multas e extras.",
        "Nome legal, NIF, endereço, país e contactos da entidade cobradora.",
        "Preço final, impostos, taxas, moeda e prazo do serviço.",
        "Canal de apoio para pagamentos e contestações.",
        "Consentimento contratual e comprovativo enviado ao cliente.",
    ], columns=2))
    s.append(Spacer(1, 3 * mm))
    s.append(callout("Particularidade do rent-a-car", "O adquirente deve confirmar o MCC, a aceitação de valores elevados, pré-autorização/caução, captura posterior e regras para cobranças adicionais. Essas capacidades variam por contrato.", "info"))

    # 8. Architecture
    s += [PageBreak()]
    s += section_title("07 | Segurança e arquitetura", "O que fica no site e o que fica no provedor", "O objetivo é reduzir o escopo PCI, impedir cobranças duplicadas e conservar uma trilha de auditoria.")
    s.append(data_table(
        ["DADO / FUNÇÃO", "SITE PEPEK", "PROVEDOR / BANCO"],
        [
            ("Valor e moeda", "Calcula a partir da fatura no servidor", "Confirma o mesmo valor e moeda"),
            ("Referência", "Gera uma referência única e idempotente", "Devolve referência oficial da transação"),
            ("Cartão, CVV ou PIN", "Nunca recebe nem armazena", "Captura em ambiente PCI DSS"),
            ("Autenticação", "Valida a sessão do cliente", "Executa 3-D Secure / autorização"),
            ("Confirmação", "Valida assinatura e estado", "Envia webhook/callback autenticado"),
            ("Reconciliação", "Regista eventos e atualiza a fatura", "Fornece extrato/relatório de liquidação"),
            ("Recibo", "Emite após confirmação válida", "Fornece a referência do pagamento"),
        ],
        [45 * mm, 66 * mm, CONTENT_W - 111 * mm],
    ))
    s.append(Spacer(1, 5 * mm))
    s.append(split_cards([
        card("Segredos", "Somente em variáveis privadas da Vercel ou cofre de segredos. Nunca usar prefixo VITE_ para chaves privadas."),
        card("Webhooks", "Validar assinatura, tempo, valor, moeda, ordem e repetição antes de liquidar a fatura."),
        card("Idempotência", "A mesma tentativa não pode criar duas cobranças. Cada pedido recebe uma chave única."),
        card("Privilégios", "Somente perfis financeiros autorizados podem reconciliar métodos manuais ou aprovar reembolsos."),
        card("Monitorização", "Alertas para falhas, divergência de valores, webhooks não processados e ordens antigas pendentes."),
        card("PCI DSS", "Preferir redirecionamento ou página hospedada pelo provedor e confirmar o SAQ aplicável com o adquirente."),
    ], cols=2))
    s.append(callout("Nunca guardar", "PAN completo, CVV/CVC, PIN, conteúdo da faixa magnética, passwords ou segredos de API em tabelas comuns, logs, analytics, mensagens de erro ou WhatsApp.", "risk"))

    # 9. Operations and RACI
    s += [PageBreak()]
    s += section_title("08 | Operação", "Responsabilidades e controlo diário", "Uma integração aprovada só permanece segura quando existe dono para reconciliação, fraude, reembolso e incidentes.")
    s.append(P("MATRIZ DE RESPONSABILIDADES", "H2X"))
    s.append(data_table(
        ["ATIVIDADE", "CLIENTE / DIREÇÃO", "BANCO / PSP", "ENGENHARIA", "FINANCEIRO"],
        [
            ("KYC e contratos", "Aprova e entrega", "Valida", "Apoia", "Confere contas"),
            ("Merchant ID e credenciais", "Autoriza", "Emite", "Configura", "Regista canal"),
            ("Integração e testes", "Aceita critérios", "Suporta", "Executa", "Valida valores"),
            ("Homologação", "Assina aceite", "Aprova", "Entrega evidência", "Reconcilia"),
            ("Produção", "Autoriza ativação", "Libera live", "Monitoriza", "Confirma liquidação"),
            ("Reembolso", "Define política", "Processa", "Mantém fluxo", "Aprova e concilia"),
            ("Chargeback/fraude", "Decide resposta", "Notifica", "Preserva logs", "Reúne evidência"),
        ],
        [42 * mm, 37 * mm, 34 * mm, 34 * mm, CONTENT_W - 147 * mm],
    ))
    s.append(Spacer(1, 5 * mm))
    s.append(P("ROTINA MÍNIMA", "H2X"))
    s.append(split_cards([
        card("Diariamente", "Ordens pendentes, pagamentos recebidos, divergências, falhas de webhook e saldo/liquidação bancária."),
        card("Semanalmente", "Reembolsos, chargebacks, tempos de resposta, taxas de aprovação e acessos administrativos."),
        card("Mensalmente", "Comissões, câmbio, reconciliação contabilística, credenciais, incidentes e desempenho por canal."),
        card("Em cada deploy", "Build, testes de autenticação, valor/moeda, repetição, sucesso, cancelamento, falha e retorno do checkout."),
    ], cols=2))
    s.append(callout("Critério para ativação", "O canal só passa a produção quando uma transação real controlada for criada, autorizada, confirmada, conciliada no banco e refletida corretamente na fatura e no recibo.", "success"))

    # 10. Final checklist and sources
    s += [PageBreak()]
    s += section_title("09 | Entrega", "Checklist final e fontes", "Os 12 elementos abaixo desbloqueiam a primeira fase de implementação.")
    s.append(checklist([
        "Documentos legais e representante autorizado.",
        "Comprovativos das contas AOA, USD e EUR.",
        "Banco escolhido para EMIS/GPO.",
        "Contrato ou protocolo de adesão EMIS iniciado.",
        "Merchant ID e credenciais de teste EMIS.",
        "Adquirente/PSP escolhido para Visa.",
        "País da entidade jurídica que receberá Visa.",
        "Moedas, settlement, taxas e limites confirmados.",
        "Políticas de caução, cancelamento e reembolso aprovadas.",
        "Responsáveis técnico, financeiro, antifraude e legal nomeados.",
        "Termos, privacidade e condições de aluguer publicados.",
        "Plano de homologação e data de teste real acordados.",
    ], columns=2))
    s.append(Spacer(1, 5 * mm))
    s.append(P("FONTES OFICIAIS CONSULTADAS", "H2X"))
    sources = [
        ("EMIS - Instrutivo n.º 02/2024", "https://www.emis.co.ao/media/qaalbuoo/intrutivo-n%C2%BA-02_2024_de-01-de-mar%C3%A7o.pdf", "Enquadramento do comerciante, banco de apoio e aceitação no Sistema MULTICAIXA."),
        ("Visa - Accept Visa Payments", "https://corporate.visa.com/en/solutions/acceptance/audiences/small-medium-business.html", "Papel da conta de comerciante, adquirente e gateway."),
        ("Visa - How to accept payments online", "https://corporate.visa.com/en/sites/visa-perspectives/innovation/how-to-accept-payments-online.html", "Comércio eletrónico, 3-D Secure, PSP e segurança."),
        ("Stripe - Global availability", "https://stripe.com/global", "Países e regiões atualmente suportados para abertura de conta."),
        ("PCI SSC - FAQ 1438", "https://www.pcisecuritystandards.org/faqs/1438/", "Elegibilidade SAQ A e origem dos elementos da página de pagamento."),
        ("PCI SSC - FAQ 1604", "https://www.pcisecuritystandards.org/faqs/1604/", "Responsabilidades atuais de segurança para e-commerce com terceiros."),
    ]
    for title, url, note in sources:
        s.append(P(f'<b>{title}</b><br/>{note}<br/><link href="{url}" color="#195A96">{url}</link>', "Source"))
    s.append(Spacer(1, 3 * mm))
    s.append(callout("Nota de utilização", "Este guia organiza a recolha e a implementação técnica. A lista documental definitiva, as taxas e os requisitos de homologação são estabelecidos pelo banco adquirente, EMIS ou PSP no contrato aplicável.", "info"))
    return s


def validate_pdf(path: Path):
    reader = PdfReader(str(path))
    if len(reader.pages) != 10:
        raise RuntimeError(f"Expected 10 pages, got {len(reader.pages)}")
    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    required = [
        "EMIS / MULTICAIXA Express",
        "Visa através de adquirente ou PSP",
        "Pacote institucional e bancário",
        "Responsabilidades e controlo diário",
        "FONTES OFICIAIS CONSULTADAS",
    ]
    missing = [item for item in required if item not in text]
    if missing:
        raise RuntimeError(f"Missing expected text: {missing}")
    return len(reader.pages), len(text)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT), pagesize=A4,
        leftMargin=MARGIN_X, rightMargin=MARGIN_X,
        topMargin=24 * mm, bottomMargin=18 * mm,
        title="Guia de Ativação de Pagamentos Digitais - PEPEK",
        author="PEPEK GRUPO RENT-A-CAR",
        subject="Preparação, integração e homologação de EMIS e Visa",
    )
    doc.build(build_story(), onFirstPage=page_decor, onLaterPages=page_decor)
    pages, chars = validate_pdf(OUT)
    print(f"Generated {OUT} ({pages} pages, {chars} extracted characters)")


if __name__ == "__main__":
    main()
