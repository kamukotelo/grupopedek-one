#!/usr/bin/env python3
"""Generate a fillable (AcroForm) PDF for PEPEK to send to the client, collecting
the company/banking/provider data needed to activate each payment method.

Brand palette matches the live site (src/ usage counts), not the older guide's
palette: navy #09172C, blue #236199, amber #FEC228.
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen.canvas import Canvas
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "FICHA-DADOS-PAGAMENTOS-PEPEK-CLIENTE.pdf"
LOGO = ROOT / "public" / "Logos" / "Positivo.png"  # white wordmark, for navy backgrounds

# ---- Brand palette (matches live site: 334x #09172C, 299x #FEC228, 230x #236199) ----
NAVY = colors.HexColor("#09172C")
NAVY_2 = colors.HexColor("#0C2E60")
BLUE = colors.HexColor("#236199")
AMBER = colors.HexColor("#FEC228")
PALE = colors.HexColor("#F4F6FA")
PALE_BLUE = colors.HexColor("#EAF1F8")
LINE = colors.HexColor("#D9DFE8")
TEXT = colors.HexColor("#12233D")
MUTED = colors.HexColor("#5B6B80")
WHITE = colors.white
FIELD_BG = colors.HexColor("#FBFCFE")

PAGE_W, PAGE_H = A4
MARGIN = 42
CONTENT_W = PAGE_W - 2 * MARGIN
HEADER_H = 92
FOOTER_Y = 30

TOTAL_PAGES = 7
_page_counter = {"n": 0}


# --------------------------------------------------------------------------- helpers

def wrap_lines(text, font, size, max_w):
    words = text.split()
    lines, line = [], ""
    for w in words:
        trial = (line + " " + w).strip()
        if stringWidth(trial, font, size) <= max_w:
            line = trial
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def draw_wrapped(c, text, x, y, max_w, font="Helvetica", size=9.3, leading=13, color=MUTED):
    c.setFont(font, size)
    c.setFillColor(color)
    cur_y = y
    for line in wrap_lines(text, font, size, max_w):
        c.drawString(x, cur_y, line)
        cur_y -= leading
    return cur_y


def start_page(c, eyebrow, title, intro=None):
    _page_counter["n"] += 1
    if _page_counter["n"] > 1:
        c.showPage()
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, stroke=0, fill=1)
    c.setFillColor(NAVY_2)
    c.circle(PAGE_W - 30, PAGE_H - 8, 64, stroke=0, fill=1)
    if LOGO.exists():
        logo_w = 30 * mm
        logo_h = logo_w * (1772 / 5325)
        c.drawImage(str(LOGO), MARGIN, PAGE_H - 20 - logo_h, width=logo_w, height=logo_h,
                    mask="auto", preserveAspectRatio=True)
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 8.4)
    c.drawString(MARGIN, PAGE_H - HEADER_H + 30, eyebrow.upper())
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 16.5)
    c.drawString(MARGIN, PAGE_H - HEADER_H + 12, title)

    cur_y = PAGE_H - HEADER_H - 22
    if intro:
        cur_y = draw_wrapped(c, intro, MARGIN, cur_y, CONTENT_W, size=9.2, leading=12.6, color=MUTED)
        cur_y -= 10
    return cur_y


def draw_footer(c):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(MARGIN, FOOTER_Y + 12, PAGE_W - MARGIN, FOOTER_Y + 12)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN, FOOTER_Y, "PEPEK GRUPO RENT-A-CAR · Ficha de dados para ativação de pagamentos · confidencial")
    c.drawRightString(PAGE_W - MARGIN, FOOTER_Y, f"Página {_page_counter['n']} de {TOTAL_PAGES}")


def section_label(c, x, y, text, color=NAVY):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 11.5)
    c.drawString(x, y, text)
    return y - 16


def note(c, x, y, w, text, kind="info"):
    palette = {
        "info": (PALE_BLUE, BLUE),
        "warn": (colors.HexColor("#FFF6DC"), colors.HexColor("#8A5A00")),
        "risk": (colors.HexColor("#FCEAE9"), colors.HexColor("#A83B3B")),
    }
    bg, accent = palette[kind]
    lines = wrap_lines(text, "Helvetica", 8.4, w - 34)
    h = 12 + len(lines) * 11.6
    c.setFillColor(bg)
    c.roundRect(x, y - h, w, h, 5, stroke=0, fill=1)
    c.setFillColor(accent)
    c.rect(x, y - h, 3, h, stroke=0, fill=1)
    c.setFillColor(accent)
    c.setFont("Helvetica", 8.4)
    cy = y - 13
    for line in lines:
        c.drawString(x + 14, cy, line)
        cy -= 11.6
    return y - h - 10


_field_counter = {"n": 0}


def text_field(c, name, x, y, w, h=19, multiline=False, maxlen=240, tooltip=None, fontsize=9.5):
    _field_counter["n"] += 1
    c.setFillColor(FIELD_BG)
    c.setStrokeColor(colors.HexColor("#B7C3D6"))
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, 2.4, stroke=1, fill=1)
    flags = "multiline" if multiline else ""
    c.acroForm.textfield(
        name=name, tooltip=tooltip or name, x=x + 1.2, y=y + 1.2, width=w - 2.4, height=h - 2.4,
        borderStyle="none", borderWidth=0, fillColor=None, textColor=TEXT,
        fontName="Helvetica", fontSize=fontsize, forceBorder=False,
        fieldFlags=flags, value="", maxlen=maxlen if not multiline else 4000,
        annotationFlags="print",
    )


def checkbox(c, name, x, y, label, size=11):
    c.acroForm.checkbox(
        name=name, tooltip=label, x=x, y=y, size=size, checked=False,
        buttonStyle="check", borderColor=colors.HexColor("#8497B0"), fillColor=WHITE,
        textColor=NAVY, borderWidth=1, forceBorder=True, annotationFlags="print",
    )
    c.setFillColor(TEXT)
    c.setFont("Helvetica", 8.6)
    c.drawString(x + size + 7, y + size / 2 - 3.2, label)


def field_row(c, fields, top_y, x0=MARGIN, w=CONTENT_W, cols=2, gap=16, h=19, label_size=8.0):
    """fields: list of dicts {label, name, full(optional bool), multiline(optional), h(optional)}"""
    col_w = (w - gap * (cols - 1)) / cols
    cur_y = top_y
    col = 0
    row_h = 0
    for f in fields:
        full = f.get("full", False)
        fh = f.get("h", h)
        if full and col != 0:
            cur_y -= row_h + 15
            col = 0
            row_h = 0
        fx = x0 if full else x0 + col * (col_w + gap)
        fw = w if full else col_w
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", label_size)
        c.drawString(fx, cur_y, f["label"].upper())
        field_top = cur_y - 5 - fh
        text_field(c, f["name"], fx, field_top, fw, fh, multiline=f.get("multiline", False),
                   tooltip=f["label"])
        row_h = max(row_h, 5 + fh)
        if full:
            cur_y -= row_h + 15
            row_h = 0
            col = 0
        else:
            col += 1
            if col == cols:
                col = 0
                cur_y -= row_h + 15
                row_h = 0
    if col != 0:
        cur_y -= row_h + 15
    return cur_y


# --------------------------------------------------------------------------- pages

def page_cover(c):
    _page_counter["n"] += 1
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(NAVY_2)
    c.circle(PAGE_W * 0.90, PAGE_H * 0.95, 100 * mm, stroke=0, fill=1)

    top = PAGE_H - 54
    logo_w = 66 * mm
    logo_h = logo_w * (1772 / 5325)
    if LOGO.exists():
        c.drawImage(str(LOGO), MARGIN, top - logo_h, width=logo_w, height=logo_h,
                    mask="auto", preserveAspectRatio=True)
    y = top - logo_h - 38

    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(MARGIN, y, "PAGAMENTOS DIGITAIS · FICHA DE DADOS")
    y -= 34

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 26)
    c.drawString(MARGIN, y, "Dados para ativação dos")
    y -= 31
    c.drawString(MARGIN, y, "métodos de pagamento")
    y -= 28

    y = draw_wrapped(
        c,
        "Este documento reúne, por método de pagamento, os dados da empresa, das contas bancárias "
        "e das credenciais que precisamos de si para ativar cada canal no site da PEPEK GRUPO. "
        "Os campos abaixo são editáveis diretamente neste PDF.",
        MARGIN, y, CONTENT_W - 30 * mm, size=10.3, leading=15,
        color=colors.HexColor("#D7E2F0"),
    )

    box_top = y - 24
    box_inner_x = MARGIN + 18
    box_inner_w = CONTENT_W - 36
    by = box_top - 24
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(box_inner_x, by, "COMO PREENCHER E DEVOLVER")
    by -= 20
    steps = [
        "Abra este PDF no Adobe Acrobat Reader, Preview (Mac) ou no navegador — os campos com moldura são editáveis.",
        "Preencha o que souber diretamente; peça ao seu banco, gestor de conta ou contabilista os campos técnicos (Merchant ID, chaves, IBAN).",
        "Não preencha o que ainda não tiver — deixe em branco e avance; podemos ativar cada método por fases.",
        "Guarde e devolva-nos o ficheiro por um canal seguro combinado (nunca por WhatsApp para chaves ou segredos).",
    ]
    for i, s in enumerate(steps, start=1):
        c.setFillColor(AMBER)
        c.setFont("Helvetica-Bold", 8.6)
        c.drawString(box_inner_x, by, f"{i}.")
        by = draw_wrapped(c, s, box_inner_x + 14, by, box_inner_w - 14, size=8.6, leading=11.8,
                           color=colors.HexColor("#C6D4E7"))
        by -= 6
    box_bottom = by + 2
    box_h = box_top - box_bottom

    c.setStrokeColor(AMBER)
    c.setLineWidth(1)
    for off in (0, 7, 14):
        c.roundRect(MARGIN + off, box_bottom - off, CONTENT_W - 2 * off, box_h + 2 * off, 10, stroke=1, fill=0)

    strip_y = box_bottom - 44
    c.setStrokeColor(colors.HexColor("#2A4A78"))
    c.setLineWidth(0.6)
    c.line(MARGIN, strip_y + 20, PAGE_W - MARGIN, strip_y + 20)
    facts = [
        ("MÉTODOS COBERTOS", "Multicaixa Express · Cartão · Transferência · MB WAY"),
        ("O QUE FAZER SE FALTAR ALGO", "Deixe o campo em branco — ativamos método a método"),
    ]
    col_w = CONTENT_W / len(facts)
    for i, (label, value) in enumerate(facts):
        fx = MARGIN + i * col_w
        c.setFillColor(AMBER)
        c.setFont("Helvetica-Bold", 7.2)
        c.drawString(fx, strip_y, label)
        c.setFillColor(colors.HexColor("#D7E2F0"))
        c.setFont("Helvetica", 8.4)
        c.drawString(fx, strip_y - 13, value)

    status_top = strip_y - 46
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(MARGIN, status_top, "ESTADO ATUAL DE CADA CANAL")
    statuses = [
        ("Transferência bancária", "Pronta no site — falta apenas confirmar os dados da conta", colors.HexColor("#3FB27F")),
        ("Multicaixa Express (EMIS)", "Em preparação — falta contrato e credenciais do banco", AMBER),
        ("Cartão internacional (Visa)", "Em preparação — falta escolher adquirente/PSP", AMBER),
        ("MB WAY (SIBS)", "Em preparação — falta contrato e credenciais SIBS", AMBER),
    ]
    row_y = status_top - 22
    for name, desc, dot in statuses:
        c.setFillColor(dot)
        c.circle(MARGIN + 4, row_y + 3, 4, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8.8)
        c.drawString(MARGIN + 15, row_y, name)
        c.setFillColor(colors.HexColor("#9FB3CC"))
        c.setFont("Helvetica", 8.2)
        c.drawString(MARGIN + 185, row_y, desc)
        row_y -= 20

    c.setFillColor(colors.HexColor("#8CA2BF"))
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN, 30, "Preparado em 15 de setembro de 2026 · Documento confidencial — uso exclusivo PEPEK GRUPO e destinatário")
    c.drawRightString(PAGE_W - MARGIN, 30, f"Página 1 de {TOTAL_PAGES}")


def page_kyc(c):
    y = start_page(
        c, "01 · Identificação", "Dados da empresa (KYC)",
        "Estes dados são pedidos por todos os métodos de pagamento — preencha uma vez só.",
    )
    y = field_row(c, [
        {"label": "Nome legal completo", "name": "kyc_nome_legal", "full": True},
        {"label": "Nome comercial", "name": "kyc_nome_comercial"},
        {"label": "NIF", "name": "kyc_nif"},
        {"label": "Número de registo comercial", "name": "kyc_registo_comercial"},
        {"label": "Data da certidão comercial", "name": "kyc_data_certidao"},
        {"label": "Morada completa da sede", "name": "kyc_morada", "full": True},
    ], y)
    y -= 4
    y = field_row(c, [
        {"label": "Representante legal — nome", "name": "kyc_rep_nome"},
        {"label": "Representante legal — cargo", "name": "kyc_rep_cargo"},
        {"label": "Email institucional", "name": "kyc_email"},
        {"label": "Telefone institucional", "name": "kyc_telefone"},
    ], y)
    y -= 4
    y = section_label(c, MARGIN, y, "Volume previsto de transações", color=BLUE)
    y = field_row(c, [
        {"label": "Nº de transações por mês (estimativa)", "name": "kyc_vol_mensal"},
        {"label": "Valor médio por transação", "name": "kyc_valor_medio"},
        {"label": "Maior transação esperada", "name": "kyc_valor_maximo"},
        {"label": "Países de origem dos clientes", "name": "kyc_paises"},
    ], y)
    note(c, MARGIN, y - 6, CONTENT_W,
         "Estes números são pedidos pelos bancos/EMIS/PSP para aprovar o contrato de comerciante — "
         "uma estimativa razoável é suficiente, não precisa de ser exata.", "info")
    draw_footer(c)


def page_bank(c):
    y = start_page(
        c, "02 · Transferência bancária", "Contas bancárias de liquidação",
        "Já funcional no site: preencha para os valores aparecerem automaticamente no ecrã de pagamento do cliente.",
    )
    y = section_label(c, MARGIN, y, "Conta em Kwanzas (AOA) · Angola", color=BLUE)
    y = field_row(c, [
        {"label": "Banco", "name": "bank_ao_nome"},
        {"label": "Titular da conta", "name": "bank_ao_titular"},
        {"label": "IBAN", "name": "bank_ao_iban", "full": True},
        {"label": "SWIFT / BIC", "name": "bank_ao_swift"},
    ], y)
    y -= 6
    y = section_label(c, MARGIN, y, "Conta em Euros (EUR) · Portugal", color=BLUE)
    y = field_row(c, [
        {"label": "Banco", "name": "bank_pt_nome"},
        {"label": "Titular da conta", "name": "bank_pt_titular"},
        {"label": "IBAN", "name": "bank_pt_iban", "full": True},
        {"label": "SWIFT / BIC", "name": "bank_pt_swift"},
    ], y)
    y -= 4
    note(c, MARGIN, y - 4, CONTENT_W,
         "Usada também para liquidações em EUR do MB WAY quando ainda não houver integração automática. "
         "Envie o comprovativo bancário (extrato ou carta do banco) juntamente com este documento.", "info")
    draw_footer(c)


def page_multicaixa(c):
    y = start_page(
        c, "03 · Canal nacional (AOA)", "Multicaixa Express · EMIS",
        "Contratado através do banco de apoio onde a conta de liquidação está domiciliada.",
    )
    y = field_row(c, [
        {"label": "Banco de apoio (contrato EMIS/GPO)", "name": "emis_banco"},
        {"label": "Número de contrato / adesão EMIS", "name": "emis_contrato"},
        {"label": "Merchant ID", "name": "emis_merchant_id"},
        {"label": "Data prevista de ativação", "name": "emis_data_ativacao"},
    ], y)
    y -= 4
    y = section_label(c, MARGIN, y, "Credenciais técnicas (enviar por canal seguro)", color=BLUE)
    y = field_row(c, [
        {"label": "API Key", "name": "emis_api_key", "full": True},
        {"label": "Segredo de assinatura dos webhooks", "name": "emis_webhook_secret", "full": True},
    ], y)
    y -= 6
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.6)
    c.drawString(MARGIN, y, "DOCUMENTOS JÁ RECEBIDOS")
    y -= 16
    checkbox(c, "emis_chk_contrato", MARGIN, y - 11, "Contrato de comerciante assinado")
    checkbox(c, "emis_chk_teste", MARGIN + 260, y - 11, "Ambiente de testes recebido")
    y -= 26
    checkbox(c, "emis_chk_producao", MARGIN, y - 11, "Ambiente de produção recebido")
    checkbox(c, "emis_chk_manual", MARGIN + 260, y - 11, "Manual de marca MULTICAIXA recebido")
    y -= 30
    note(c, MARGIN, y, CONTENT_W,
         "Sem estas credenciais o método fica \"pendente\" no site — cria a referência mas não confirma "
         "o pagamento sozinho. A confirmação automática só liga depois de recebermos a API Key e o segredo do webhook.",
         "warn")
    draw_footer(c)


def page_card(c):
    y = start_page(
        c, "04 · Cartão internacional", "Visa / Mastercard — Stripe ou adquirente",
        "Objetivo: aceitar cartões de clientes internacionais com autenticação 3-D Secure.",
    )
    y = field_row(c, [
        {"label": "Adquirente / PSP escolhido", "name": "card_adquirente"},
        {"label": "País da entidade que recebe os pagamentos", "name": "card_pais_entidade"},
        {"label": "Merchant ID / conta de comerciante", "name": "card_merchant_id"},
        {"label": "Moeda de liquidação", "name": "card_moeda"},
    ], y)
    y -= 4
    y = section_label(c, MARGIN, y, "Credenciais técnicas (enviar por canal seguro)", color=BLUE)
    y = field_row(c, [
        {"label": "Chave de API / Secret Key", "name": "card_api_key", "full": True},
        {"label": "Segredo do webhook", "name": "card_webhook_secret", "full": True},
        {"label": "Conta bancária de destino da liquidação", "name": "card_conta_destino", "full": True},
    ], y)
    y -= 6
    checkbox(c, "card_chk_elegibilidade", MARGIN, y - 11, "Elegibilidade da entidade/país confirmada junto do adquirente")
    y -= 30
    note(c, MARGIN, y, CONTENT_W,
         "Confirme primeiro que a entidade e o país da PEPEK são elegíveis junto do adquirente/PSP escolhido "
         "antes de nos enviar as chaves — evita retrabalho de integração.", "risk")
    draw_footer(c)


def page_mbway(c):
    y = start_page(
        c, "05 · Canal Portugal (EUR)", "MB WAY · SIBS",
        "Contratado junto do banco de apoio em Portugal ou diretamente com a SIBS.",
    )
    y = field_row(c, [
        {"label": "Banco de apoio (Portugal)", "name": "mbway_banco"},
        {"label": "Número de adesão SIBS", "name": "mbway_contrato"},
        {"label": "Merchant ID", "name": "mbway_merchant_id"},
        {"label": "Data prevista de ativação", "name": "mbway_data_ativacao"},
    ], y)
    y -= 4
    y = section_label(c, MARGIN, y, "Credenciais técnicas (enviar por canal seguro)", color=BLUE)
    y = field_row(c, [
        {"label": "API Key", "name": "mbway_api_key", "full": True},
        {"label": "Segredo de assinatura dos webhooks", "name": "mbway_webhook_secret", "full": True},
    ], y)
    y -= 6
    note(c, MARGIN, y, CONTENT_W,
         "Tal como o Multicaixa, o site já sabe validar e reconciliar a confirmação assinada da SIBS — "
         "falta apenas o contrato e estas credenciais para ligar a chamada real.", "info")
    draw_footer(c)


def page_notes(c):
    y = start_page(
        c, "06 · Fecho", "Observações e confirmação",
        "Espaço livre para esclarecimentos, prazos ou condições acordadas com bancos/PSP.",
    )
    text_field(c, "obs_texto", MARGIN, y - 150, CONTENT_W, 150, multiline=True,
               tooltip="Observações")
    y = y - 150 - 20
    y = field_row(c, [
        {"label": "Preenchido por (nome)", "name": "assinatura_nome"},
        {"label": "Cargo", "name": "assinatura_cargo"},
        {"label": "Data de preenchimento", "name": "assinatura_data"},
        {"label": "Contacto direto para dúvidas", "name": "assinatura_contacto"},
    ], y)
    y -= 6
    note(c, MARGIN, y, CONTENT_W,
         "Número completo do cartão, CVV e PIN nunca devem constar deste documento. Chaves de API e segredos "
         "de webhook devem seguir por um canal seguro combinado com a PEPEK — nunca por WhatsApp ou email aberto.",
         "risk")
    draw_footer(c)


def validate_pdf(path: Path):
    reader = PdfReader(str(path))
    if len(reader.pages) != TOTAL_PAGES:
        raise RuntimeError(f"Expected {TOTAL_PAGES} pages, got {len(reader.pages)}")
    fields = reader.get_fields() or {}
    if len(fields) < 40:
        raise RuntimeError(f"Expected a fully fillable form, only found {len(fields)} fields")
    text = "\n".join(page.extract_text() or "" for page in reader.pages).lower()
    required = ["multicaixa express", "mb way", "visa", "transferência bancária", "observações"]
    missing = [r for r in required if r not in text]
    if missing:
        raise RuntimeError(f"Missing expected text: {missing}")
    return len(reader.pages), len(fields)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = Canvas(str(OUT), pagesize=A4)
    c.setTitle("Ficha de Dados para Ativação de Pagamentos — PEPEK GRUPO")
    c.setAuthor("PEPEK GRUPO RENT-A-CAR")
    c.setSubject("Dados de empresa, contas bancárias e credenciais por método de pagamento")

    page_cover(c)
    page_kyc(c)
    page_bank(c)
    page_multicaixa(c)
    page_card(c)
    page_mbway(c)
    page_notes(c)

    c.save()
    pages, n_fields = validate_pdf(OUT)
    print(f"Generated {OUT} ({pages} pages, {n_fields} form fields)")


if __name__ == "__main__":
    main()
