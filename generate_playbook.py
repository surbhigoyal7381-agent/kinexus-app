"""
Kinexus Systems — Export Readiness Playbook PDF Generator
Run: python generate_playbook.py
Output: assets/export-readiness-playbook.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
    Table, TableStyle, Image, HRFlowable, KeepTogether, PageBreak
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.lib.colors import HexColor

# ── Brand colours ────────────────────────────────────────────────
NAVY        = HexColor('#182461')
NAVY_DARK   = HexColor('#0e1640')
STEEL       = HexColor('#2733a0')
STEEL_LIGHT = HexColor('#3585d4')
BLUE_LIGHT  = HexColor('#56a0e8')
BLUE_PALE   = HexColor('#dbeafe')
SILVER      = HexColor('#8fa3b8')
TEXT        = HexColor('#1a2535')
TEXT_MUTED  = HexColor('#4a5f7a')
WHITE       = colors.white
BORDER      = HexColor('#dde4ec')
SURFACE     = HexColor('#f0f4f8')
GREEN       = HexColor('#059669')
AMBER       = HexColor('#d97706')
RED         = HexColor('#dc2626')

PAGE_W, PAGE_H = A4
MARGIN_L = 18 * mm
MARGIN_R = 18 * mm
MARGIN_T = 22 * mm
MARGIN_B = 22 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

LOGO_PATH = os.path.join(os.path.dirname(__file__), 'assets', 'kinexus-logo-full.png')
OUT_PATH  = os.path.join(os.path.dirname(__file__), 'assets', 'export-readiness-playbook.pdf')


# ── Reusable coloured block flowable ────────────────────────────
class ColorRect(Flowable):
    def __init__(self, w, h, fill, radius=4):
        super().__init__()
        self.width = w
        self.height = h
        self.fill = fill
        self.radius = radius

    def draw(self):
        self.canv.setFillColor(self.fill)
        self.canv.roundRect(0, 0, self.width, self.height, self.radius, fill=1, stroke=0)


class AccentBar(Flowable):
    """Thin horizontal rule in brand colour."""
    def __init__(self, w, color=STEEL_LIGHT, h=2):
        super().__init__()
        self.width = w
        self.height = h
        self._color = color

    def draw(self):
        self.canv.setFillColor(self._color)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)


class IconBullet(Flowable):
    """Small filled circle accent before list items."""
    def __init__(self, color=STEEL_LIGHT, size=5):
        super().__init__()
        self.width = 10
        self.height = size
        self._color = color
        self._size = size

    def draw(self):
        self.canv.setFillColor(self._color)
        r = self._size / 2
        self.canv.circle(r, r, r, fill=1, stroke=0)


# ── Page canvas callbacks ────────────────────────────────────────
def draw_cover(c: canvas.Canvas, doc):
    W, H = PAGE_W, PAGE_H

    # Full-page navy gradient background (two-rect approximation)
    c.setFillColor(NAVY_DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Diagonal accent panel (lighter navy)
    c.setFillColor(HexColor('#1a2d6e'))
    p = c.beginPath()
    p.moveTo(0, H)
    p.lineTo(W, H)
    p.lineTo(W, H * 0.45)
    p.lineTo(0, H * 0.62)
    p.close()
    c.drawPath(p, fill=1, stroke=0)

    # Subtle grid dots
    c.setFillColor(HexColor('#ffffff'))
    c.setFillAlpha(0.04)
    step = 22
    for x in range(0, int(W) + step, step):
        for y in range(0, int(H) + step, step):
            c.circle(x, y, 1, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Steel-light bottom stripe
    c.setFillColor(STEEL_LIGHT)
    c.rect(0, 0, W, 5, fill=1, stroke=0)

    # Logo
    try:
        logo_w = 130
        logo_h = 55
        c.drawImage(LOGO_PATH, MARGIN_L, H - MARGIN_T - logo_h,
                    width=logo_w, height=logo_h, preserveAspectRatio=True, mask='auto')
    except Exception:
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 18)
        c.drawString(MARGIN_L, H - MARGIN_T - 20, 'KINEXUS SYSTEMS')

    # Eyebrow label
    c.setFillColor(BLUE_LIGHT)
    c.setFont('Helvetica-Bold', 8)
    c.drawString(MARGIN_L, H * 0.60, 'E X P O R T   R E A D I N E S S   P L A Y B O O K')

    # Accent bar under eyebrow
    c.setFillColor(STEEL_LIGHT)
    c.rect(MARGIN_L, H * 0.60 - 4, 40, 2, fill=1, stroke=0)

    # Main title
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 36)
    c.drawString(MARGIN_L, H * 0.50, 'From Ready to')
    c.setFillColor(BLUE_LIGHT)
    c.drawString(MARGIN_L, H * 0.50 - 44, 'Export-Ready')

    # Subtitle
    c.setFillColor(HexColor('#aabbdd'))
    c.setFont('Helvetica', 13)
    c.drawString(MARGIN_L, H * 0.50 - 80,
                 'Your step-by-step guide to building a globally')
    c.drawString(MARGIN_L, H * 0.50 - 96, 'competitive, AI-enabled export operation.')

    # Stat pills at bottom left
    pill_data = [('6 Weeks', 'First outcome'), ('4 Stages', 'Crawl → Fly'), ('Sprint 0', 'TRA included')]
    px = MARGIN_L
    for val, lbl in pill_data:
        bw = 82
        c.setFillColor(HexColor('#ffffff'))
        c.setFillAlpha(0.08)
        c.roundRect(px, 28, bw, 36, 4, fill=1, stroke=0)
        c.setFillAlpha(1)
        c.setFillColor(BLUE_LIGHT)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(px + bw / 2, 51, val)
        c.setFillColor(HexColor('#aabbdd'))
        c.setFont('Helvetica', 7.5)
        c.drawCentredString(px + bw / 2, 36, lbl)
        px += bw + 8

    # Year / edition
    c.setFillColor(SILVER)
    c.setFont('Helvetica', 8)
    c.drawRightString(W - MARGIN_R, 18, '© 2025 Kinexus Systems Pvt. Ltd.  |  kinexus.co.in')


def draw_header_footer(c: canvas.Canvas, doc):
    W, H = PAGE_W, PAGE_H
    page_num = doc.page

    # Top accent bar
    c.setFillColor(NAVY)
    c.rect(0, H - 14 * mm, W, 14 * mm, fill=1, stroke=0)

    # Logo in header
    try:
        c.drawImage(LOGO_PATH, MARGIN_L, H - 12 * mm,
                    width=60, height=10 * mm, preserveAspectRatio=True, mask='auto')
    except Exception:
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(MARGIN_L, H - 9 * mm, 'KINEXUS SYSTEMS')

    # Chapter / doc title top-right
    c.setFillColor(BLUE_LIGHT)
    c.setFont('Helvetica', 8)
    c.drawRightString(W - MARGIN_R, H - 8 * mm, 'Export Readiness Playbook')

    # Bottom accent line
    c.setFillColor(STEEL_LIGHT)
    c.rect(0, MARGIN_B - 8 * mm, W, 1.5, fill=1, stroke=0)

    # Footer text
    c.setFillColor(TEXT_MUTED)
    c.setFont('Helvetica', 7.5)
    c.drawString(MARGIN_L, MARGIN_B - 12 * mm, '© 2025 Kinexus Systems Pvt. Ltd.  |  kinexus.co.in  |  hello@kinexus.in')
    c.setFillColor(STEEL)
    c.setFont('Helvetica-Bold', 8)
    c.drawRightString(W - MARGIN_R, MARGIN_B - 12 * mm, f'Page {page_num}')


# ── Style definitions ────────────────────────────────────────────
def make_styles():
    base = ParagraphStyle('base', fontName='Helvetica', fontSize=10,
                          leading=15, textColor=TEXT, spaceAfter=6)

    styles = {
        'h1': ParagraphStyle('h1', parent=base, fontName='Helvetica-Bold',
                             fontSize=22, leading=28, textColor=NAVY,
                             spaceBefore=14, spaceAfter=8),
        'h2': ParagraphStyle('h2', parent=base, fontName='Helvetica-Bold',
                             fontSize=15, leading=20, textColor=STEEL,
                             spaceBefore=18, spaceAfter=6),
        'h3': ParagraphStyle('h3', parent=base, fontName='Helvetica-Bold',
                             fontSize=11.5, leading=15, textColor=NAVY,
                             spaceBefore=12, spaceAfter=4),
        'body': ParagraphStyle('body', parent=base, fontSize=10, leading=16,
                               textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=8),
        'lead': ParagraphStyle('lead', parent=base, fontSize=12, leading=18,
                               textColor=TEXT_MUTED, alignment=TA_JUSTIFY, spaceAfter=10),
        'bullet': ParagraphStyle('bullet', parent=base, fontSize=10, leading=15,
                                 leftIndent=14, textColor=TEXT, spaceAfter=5),
        'caption': ParagraphStyle('caption', parent=base, fontSize=8, leading=11,
                                  textColor=SILVER, alignment=TA_CENTER),
        'label': ParagraphStyle('label', parent=base, fontName='Helvetica-Bold',
                                fontSize=7.5, textColor=STEEL_LIGHT,
                                spaceAfter=4, spaceBefore=4),
        'callout': ParagraphStyle('callout', parent=base, fontName='Helvetica-Bold',
                                  fontSize=11, leading=16, textColor=WHITE),
        'callout_sub': ParagraphStyle('callout_sub', parent=base, fontSize=9.5,
                                      leading=14, textColor=HexColor('#c8d8f0')),
        'toc': ParagraphStyle('toc', parent=base, fontSize=10.5, leading=18,
                              textColor=TEXT, leftIndent=0),
        'footer_note': ParagraphStyle('footer_note', parent=base, fontSize=8.5,
                                      leading=13, textColor=TEXT_MUTED,
                                      alignment=TA_CENTER),
        'check': ParagraphStyle('check', parent=base, fontSize=10, leading=16,
                                leftIndent=16, textColor=TEXT, spaceAfter=4),
    }
    return styles


# ── Helper builders ──────────────────────────────────────────────
def section_heading(title: str, subtitle: str, styles: dict):
    """Numbered section header block."""
    items = [
        Spacer(1, 6),
        Paragraph(f'<font color="#{STEEL_LIGHT.hexval()}">{subtitle.upper()}</font>', styles['label']),
        Paragraph(title, styles['h1']),
        AccentBar(CONTENT_W, STEEL_LIGHT, 2),
        Spacer(1, 10),
    ]
    return items


def callout_box(heading: str, body: str, styles: dict, color=STEEL):
    """Dark navy callout card."""
    inner = [
        Paragraph(heading, styles['callout']),
        Spacer(1, 4),
        Paragraph(body, styles['callout_sub']),
    ]
    t = Table([[inner]], colWidths=[CONTENT_W - 4])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('ROUNDEDCORNERS', [5]),
        ('PADDING', (0, 0), (-1, -1), 14),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 16),
        ('RIGHTPADDING', (0, 0), (-1, -1), 16),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
    ]))
    return [t, Spacer(1, 12)]


def info_box(text: str, styles: dict, bg=BLUE_PALE, border=STEEL_LIGHT):
    """Light info panel."""
    inner = [Paragraph(text, ParagraphStyle('ib', fontName='Helvetica', fontSize=9.5,
                                             leading=14, textColor=NAVY))]
    t = Table([[inner]], colWidths=[CONTENT_W - 4])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('LINEAFTER', (0, 0), (0, -1), 3, border),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return [t, Spacer(1, 10)]


def stage_card(number: str, title: str, desc: str, color, styles: dict, bullets=None):
    """Crawl/Walk/Run/Fly stage card."""
    badge = Table([[Paragraph(f'<b>{number}</b>', ParagraphStyle(
        'badge', fontName='Helvetica-Bold', fontSize=13, textColor=WHITE))]],
        colWidths=[30])
    badge.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), color),
        ('ROUNDEDCORNERS', [4]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))

    body_items = [
        Paragraph(f'<b>{title}</b>', ParagraphStyle('sc', fontName='Helvetica-Bold',
                                                     fontSize=11, textColor=color)),
        Spacer(1, 3),
        Paragraph(desc, ParagraphStyle('sd', fontName='Helvetica', fontSize=9.5,
                                        leading=14, textColor=TEXT_MUTED)),
    ]
    if bullets:
        for b in bullets:
            body_items.append(Paragraph(f'✓  {b}', ParagraphStyle(
                'sb', fontName='Helvetica', fontSize=9, leading=13,
                textColor=TEXT, leftIndent=4, spaceAfter=2)))

    t = Table([[badge, body_items]], colWidths=[38, CONTENT_W - 38 - 4])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('LEFTPADDING', (1, 0), (1, -1), 12),
        ('BACKGROUND', (0, 0), (-1, -1), SURFACE),
        ('ROUNDEDCORNERS', [4]),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER),
    ]))
    return [t, Spacer(1, 8)]


def checklist_item(text: str, styles: dict, done=False):
    box = '☑' if done else '☐'
    return Paragraph(f'{box}  {text}', styles['check'])


def metrics_row(items: list, styles: dict):
    """Row of 3 metric stat boxes."""
    cells = []
    for val, label in items:
        inner = [
            Paragraph(f'<b><font color="#{STEEL.hexval()}" size="20">{val}</font></b>',
                      ParagraphStyle('mv', fontName='Helvetica-Bold', fontSize=20,
                                     textColor=STEEL, alignment=TA_CENTER)),
            Paragraph(label, ParagraphStyle('ml', fontName='Helvetica', fontSize=8.5,
                                             textColor=TEXT_MUTED, alignment=TA_CENTER,
                                             leading=12)),
        ]
        cells.append(inner)

    t = Table([cells], colWidths=[(CONTENT_W) / len(items)] * len(items))
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), SURFACE),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return [t, Spacer(1, 12)]


# ── Document build ───────────────────────────────────────────────
def build():
    styles = make_styles()
    story = []

    # ── Cover (blank — drawn in onPage) ─────────────────────────
    story.append(PageBreak())   # triggers cover page

    # ── Page 2: About This Playbook ──────────────────────────────
    story += section_heading('About This Playbook',
                             'Introduction', styles)

    story.append(Paragraph(
        'This playbook is your practical guide to transforming your organisation\'s '
        'export operations with structured methodology, AI-enabled tooling, and '
        'proven frameworks. Whether you are new to export markets or looking to '
        'scale your existing international footprint, the Kinexus Export Readiness '
        'framework gives you a clear, measurable path forward.',
        styles['lead']))

    story += info_box(
        '⚑  Kinexus Systems is an agentic-workflow and AI-transformation consultancy. '
        'We embed next-generation technology into operations — not as bolt-ons, but as '
        'core infrastructure — so organisations achieve measurable outcomes in weeks, '
        'not quarters.',
        styles)

    story.append(Paragraph('What You Will Learn', styles['h2']))
    for item in [
        'How to assess your current export readiness across 5 dimensions.',
        'The Kinexus 4-Stage framework: Crawl → Walk → Run → Fly.',
        'How to complete Sprint 0 — your Technology Readiness Assessment (TRA).',
        'A 6-week roadmap to your first measurable export outcome.',
        'Practical checklists for team, technology, process and compliance.',
        'How to build a self-optimising export engine with AI agents.',
    ]:
        story.append(Paragraph(f'→  {item}', styles['bullet']))

    story.append(Spacer(1, 8))
    story += metrics_row([
        ('6 Wks', 'First measurable\noutcome delivered'),
        ('4 Stages', 'Crawl → Walk\n→ Run → Fly'),
        ('Sprint 0', 'Technology Readiness\nAssessment included'),
    ], styles)

    story.append(Paragraph('Who This Is For', styles['h2']))
    story.append(Paragraph(
        'This playbook is designed for founders, CEOs, export managers, and '
        'operations leads of growth-stage businesses that are serious about '
        'entering or accelerating in international markets. You do not need a '
        'technology background — our team handles the technical architecture '
        'while you focus on market strategy and relationships.',
        styles['body']))

    story.append(PageBreak())

    # ── Page 3: Export Readiness — 5 Dimensions ─────────────────
    story += section_heading('The 5 Dimensions of Export Readiness',
                             'Framework Overview', styles)

    story.append(Paragraph(
        'Before any technology or process investment, Kinexus assesses your '
        'organisation across five core dimensions. Each dimension is scored '
        '1–5 during Sprint 0, giving you a baseline readiness score and a '
        'prioritised action plan.',
        styles['body']))

    dim_data = [
        ['Dimension', 'What We Measure', 'Min. Score to Export'],
        ['1. Market Intelligence', 'Data sources, buyer insights, pricing models, competitor tracking', '3 / 5'],
        ['2. Operational Capacity', 'Production scalability, quality systems, lead-time consistency', '3 / 5'],
        ['3. Compliance & Regulation', 'Export licensing, customs classification, trade agreements', '4 / 5'],
        ['4. Digital Infrastructure', 'ERP/CRM integration, e-commerce readiness, data pipelines', '2 / 5'],
        ['5. Financial Resilience', 'FX risk management, payment terms, working-capital buffers', '3 / 5'],
    ]
    dim_col_w = [52 * mm, 88 * mm, 32 * mm]
    dt = Table(dim_data, colWidths=dim_col_w, repeatRows=1)
    dt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SURFACE]),
        ('TEXTCOLOR', (0, 1), (-1, -1), TEXT),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('FONTNAME', (2, 1), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2, 1), (2, -1), STEEL),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(dt)
    story.append(Spacer(1, 14))

    story += callout_box(
        '🎯  Your Readiness Score Drives the Plan',
        'After Sprint 0, you receive a dimension-by-dimension score card. '
        'Dimensions scoring below threshold become Sprint 1 priorities. '
        'Kinexus co-designs a sprint backlog with your team to close each gap '
        'in the fastest, most capital-efficient sequence.',
        styles, STEEL)

    story.append(PageBreak())

    # ── Page 4: The 4-Stage Framework ───────────────────────────
    story += section_heading('The 4-Stage Framework',
                             'Crawl → Walk → Run → Fly', styles)

    story.append(Paragraph(
        'Every organisation moves through four stages of export capability maturity. '
        'The Kinexus framework is designed so each stage builds directly on the last — '
        'reducing risk, compounding value, and delivering observable outcomes at every step.',
        styles['body']))

    story += stage_card('1', 'CRAWL — Foundation & Readiness',
        'Establish the baseline. Get compliant. Build the data infrastructure that '
        'makes everything else possible.',
        RED, styles, bullets=[
            'Sprint 0 Technology Readiness Assessment completed',
            'Export compliance checklist signed off',
            'Core data pipelines connected (ERP, CRM, market feeds)',
            'Team trained on export processes and tools',
        ])

    story += stage_card('2', 'WALK — Process Automation & Market Entry',
        'Automate high-friction export workflows. Launch in your priority market. '
        'Measure everything.',
        AMBER, styles, bullets=[
            'Customs and documentation workflows automated',
            'Buyer outreach sequences live with CRM integration',
            'First shipment or digital delivery completed',
            'Weekly KPI dashboard operational',
        ])

    story += stage_card('3', 'RUN — Scale & Optimisation',
        'Expand market coverage. Use AI agents for pricing, forecasting and '
        'relationship management at scale.',
        STEEL_LIGHT, styles, bullets=[
            'Multi-market pipeline active (3–5 markets)',
            'AI-assisted demand forecasting deployed',
            'Dynamic pricing engine live',
            'Customer success automation in place',
        ])

    story += stage_card('4', 'FLY — Autonomous Export Engine',
        'Your export operation runs with minimal manual intervention. '
        'Kinexus agentic workflows handle monitoring, alerting and optimisation.',
        GREEN, styles, bullets=[
            'End-to-end agentic workflow monitoring active',
            'Self-healing compliance alerts configured',
            'Continuous market intelligence feed operational',
            'Monthly board-level export performance report automated',
        ])

    story.append(PageBreak())

    # ── Page 5: Sprint 0 ─────────────────────────────────────────
    story += section_heading('Sprint 0: Technology Readiness Assessment',
                             'Where Every Engagement Starts', styles)

    story.append(Paragraph(
        'Sprint 0 is a structured 2-week diagnostic that gives you a clear, '
        'unbiased picture of where your organisation stands today — and exactly '
        'what it will take to reach export readiness. It is not a sales exercise; '
        'it is a working engagement that delivers a tangible, actionable output.',
        styles['lead']))

    story.append(Paragraph('What Sprint 0 Covers', styles['h2']))

    sprint0_data = [
        ['Week', 'Activity', 'Output'],
        ['1', 'Stakeholder interviews (ops, finance, tech, sales)\nCurrent-state process mapping\nTechnology stack audit', 'Process maps\nStack inventory\nGap analysis draft'],
        ['2', 'Dimension scoring (1–5 across all 5 areas)\nRisk register creation\nSprint backlog drafting\nReadiness Score Card presentation', 'Readiness Score Card\nPrioritised sprint backlog\nImplementation roadmap'],
    ]
    s0t = Table(sprint0_data, colWidths=[18 * mm, 90 * mm, 64 * mm], repeatRows=1)
    s0t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SURFACE]),
        ('TEXTCOLOR', (0, 1), (-1, -1), TEXT),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (0, -1), STEEL),
        ('FONTSIZE', (0, 1), (0, -1), 14),
    ]))
    story.append(s0t)
    story.append(Spacer(1, 14))

    story += callout_box(
        '📋  Deliverables You Receive at Sprint 0 Close',
        '1.  Export Readiness Score Card (5-dimension radar with benchmark)\n'
        '2.  Risk register with mitigation priorities\n'
        '3.  Prioritised sprint backlog (Weeks 1–6)\n'
        '4.  Recommended technology stack with vendor shortlist\n'
        '5.  Budget and timeline estimate for Stages 1–4',
        styles, NAVY_DARK)

    story.append(PageBreak())

    # ── Page 6: 6-Week Roadmap ───────────────────────────────────
    story += section_heading('The 6-Week Roadmap to First Outcome',
                             'Sprint Delivery Plan', styles)

    story.append(Paragraph(
        'After Sprint 0, Kinexus runs a focused 6-week delivery sprint. '
        'Each week has a defined theme, work packages and acceptance criteria '
        'agreed with your team in advance.',
        styles['body']))

    week_data = [
        ['Wk', 'Theme', 'Key Deliverables', 'Owner'],
        ['1', 'Foundations', 'Data environment set up\nAccess provisioned\nBaseline KPIs agreed', 'Kinexus + Client IT'],
        ['2', 'Integration', 'ERP/CRM connectors live\nData quality validated\nFirst dashboard draft', 'Kinexus Tech'],
        ['3', 'Automation Build', 'Workflow 1 automated\nUser acceptance testing\nTraining session 1', 'Kinexus + Ops Lead'],
        ['4', 'Compliance', 'Documentation templates deployed\nCompliance checklist signed\nRegulatory review', 'Kinexus + Legal'],
        ['5', 'Go-Live', 'First export transaction processed\nKPIs live on dashboard\nIssue log reviewed', 'Joint Team'],
        ['6', 'Optimise & Hand-off', 'Performance review\nBacklog for Stage 2 agreed\nKnowledge transfer done', 'Kinexus PM'],
    ]
    wt = Table(week_data, colWidths=[12 * mm, 36 * mm, 90 * mm, 34 * mm], repeatRows=1)
    wt.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), STEEL),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SURFACE]),
        ('TEXTCOLOR', (0, 1), (-1, -1), TEXT),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (0, -1), STEEL_LIGHT),
        ('FONTSIZE', (0, 1), (0, -1), 13),
    ]))
    story.append(wt)
    story.append(Spacer(1, 14))

    story += info_box(
        '💡  All sprints use two-week review cycles with a live Kanban board shared with '
        'your team. You always know what is in progress, what is blocked, and what is done. '
        'There are no surprise scope changes — any new requirements are triaged into the '
        'next sprint backlog with your approval.',
        styles)

    story.append(PageBreak())

    # ── Page 7: Readiness Checklists ────────────────────────────
    story += section_heading('Export Readiness Checklists',
                             'Self-Assessment Tool', styles)

    story.append(Paragraph(
        'Use the checklists below to assess your current readiness before your '
        'Sprint 0 engagement. Items marked as incomplete become priority inputs '
        'to your sprint backlog.',
        styles['body']))

    check_sections = [
        ('Team & Leadership', [
            'Export champion identified at C-suite level',
            'Dedicated export operations resource assigned',
            'Cross-functional export team formed (finance, ops, sales)',
            'Team completed at least one export-compliance training module',
        ]),
        ('Technology & Data', [
            'ERP system operational and data validated',
            'CRM capturing international lead and customer data',
            'Business intelligence / reporting tool in place',
            'Secure cloud file storage for compliance documents',
        ]),
        ('Process & Compliance', [
            'Export Control Classification Number (ECCN) determined',
            'HS codes mapped for all exportable product lines',
            'DGFT registration or equivalent authority registration active',
            'AML / KYC procedure documented for international buyers',
            'Incoterms policy agreed with finance and logistics',
        ]),
        ('Market & Commercial', [
            'At least 2 target export markets identified with market-sizing data',
            'Competitive pricing model for priority market completed',
            'Distributor or agent shortlist for priority market prepared',
            'FX hedging strategy agreed with CFO / finance lead',
        ]),
    ]

    for section_title, items in check_sections:
        story.append(Paragraph(section_title, styles['h3']))
        story.append(AccentBar(CONTENT_W * 0.3, STEEL_LIGHT, 1.5))
        story.append(Spacer(1, 6))
        for item in items:
            story.append(checklist_item(item, styles))
        story.append(Spacer(1, 10))

    story.append(PageBreak())

    # ── Page 8: AI & Agentic Advantage ──────────────────────────
    story += section_heading('The AI & Agentic Advantage',
                             'Why Kinexus is Different', styles)

    story.append(Paragraph(
        'Traditional export consultancies deliver reports. Kinexus delivers '
        'running systems. Our differentiator is agentic AI — autonomous software '
        'agents that monitor, act and improve your export operations continuously, '
        '24 hours a day, without adding headcount.',
        styles['lead']))

    story.append(Paragraph('What Agentic Workflows Replace', styles['h2']))

    comparison_data = [
        ['Manual Process', 'Kinexus Agentic Alternative', 'Time Saved'],
        ['Manually collating weekly export KPI reports', 'Auto-generated dashboard refreshed daily', '4–6 hrs/wk'],
        ['Manually checking HS code and duty updates', 'Regulatory monitoring agent with instant alerts', '2–3 hrs/wk'],
        ['Chasing freight forwarders for shipment ETAs', 'Logistics tracking agent with escalation rules', '3–4 hrs/wk'],
        ['Building buyer outreach email sequences', 'AI-personalised outreach with CRM logging', '5–8 hrs/wk'],
        ['Producing monthly compliance attestation', 'Automated audit trail with one-click reporting', '6–10 hrs/wk'],
    ]
    ct = Table(comparison_data, colWidths=[58 * mm, 76 * mm, 38 * mm], repeatRows=1)
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, SURFACE]),
        ('TEXTCOLOR', (0, 1), (-1, -1), TEXT),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('FONTNAME', (2, 1), (2, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2, 1), (2, -1), GREEN),
    ]))
    story.append(ct)
    story.append(Spacer(1, 14))

    story.append(Paragraph('Our Technology Principles', styles['h2']))
    principles = [
        ('No Black Boxes', 'Every agentic workflow is documented, auditable and explainable to your board.'),
        ('Human-in-the-Loop', 'Agents act autonomously within approved boundaries. Exceptions always escalate to a human.'),
        ('Vendor-Agnostic', 'We select the best tool for your context — not the one that pays us a referral fee.'),
        ('Own Your Data', 'Your data stays in your environment. Kinexus never retains client data after engagement close.'),
    ]
    for title, desc in principles:
        story.append(Paragraph(
            f'<b><font color="#{STEEL.hexval()}">{title}</font></b>  —  {desc}',
            styles['body']))

    story.append(PageBreak())

    # ── Page 9: Next Steps / CTA ─────────────────────────────────
    story += section_heading('Your Next Steps',
                             'Book Your Sprint 0 Today', styles)

    story.append(Paragraph(
        'Getting started is simple. Sprint 0 can begin within two weeks of '
        'signing. There are no long procurement cycles, no RFP required. '
        'We work directly with your leadership team to kick off immediately.',
        styles['lead']))

    steps_data = [
        [Paragraph('<b>Step 1</b>', ParagraphStyle('s1', fontName='Helvetica-Bold', fontSize=11, textColor=WHITE)),
         Paragraph('<b>Book a 30-minute discovery call</b><br/>Tell us your export ambition and current situation. We will confirm whether Sprint 0 is the right starting point.',
                   ParagraphStyle('s1d', fontName='Helvetica', fontSize=9.5, leading=14, textColor=HexColor('#c8d8f0')))],
        [Paragraph('<b>Step 2</b>', ParagraphStyle('s1', fontName='Helvetica-Bold', fontSize=11, textColor=WHITE)),
         Paragraph('<b>Receive Sprint 0 proposal</b><br/>Within 48 hours of your call, we send a fixed-scope, fixed-price Sprint 0 proposal. No ambiguity, no hidden fees.',
                   ParagraphStyle('s1d', fontName='Helvetica', fontSize=9.5, leading=14, textColor=HexColor('#c8d8f0')))],
        [Paragraph('<b>Step 3</b>', ParagraphStyle('s1', fontName='Helvetica-Bold', fontSize=11, textColor=WHITE)),
         Paragraph('<b>Sprint 0 kicks off</b><br/>Your Kinexus lead consultant and technical architect are assigned. Stakeholder interviews scheduled in week one.',
                   ParagraphStyle('s1d', fontName='Helvetica', fontSize=9.5, leading=14, textColor=HexColor('#c8d8f0')))],
        [Paragraph('<b>Step 4</b>', ParagraphStyle('s1', fontName='Helvetica-Bold', fontSize=11, textColor=WHITE)),
         Paragraph('<b>Readiness Score Card delivered</b><br/>Two weeks later, you have a complete picture of your export readiness and a fully costed implementation roadmap.',
                   ParagraphStyle('s1d', fontName='Helvetica', fontSize=9.5, leading=14, textColor=HexColor('#c8d8f0')))],
    ]
    st = Table(steps_data, colWidths=[22 * mm, CONTENT_W - 22 * mm])
    st.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), NAVY),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (0, -1), 14),
        ('LEFTPADDING', (1, 0), (1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, -2), 0.4, HexColor('#2a3d7a')),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
    ]))
    story.append(st)
    story.append(Spacer(1, 18))

    story += callout_box(
        '📧  Ready to start? Contact us today.',
        'Email:  hello@kinexus.in\n'
        'Web:    kinexus.co.in\n'
        'Book a call via the website — we typically respond within 4 business hours.',
        styles, STEEL_LIGHT)

    story.append(Spacer(1, 10))
    story.append(Paragraph(
        'Kinexus Systems Pvt. Ltd.  |  Registered in India  |  kinexus.co.in  |  hello@kinexus.in\n'
        'This playbook is provided for informational purposes. All frameworks and '
        'methodologies are proprietary to Kinexus Systems Pvt. Ltd. '
        '© 2025 Kinexus Systems Pvt. Ltd. All rights reserved.',
        styles['footer_note']))

    # ── Assemble document ────────────────────────────────────────
    def on_cover(c, doc):
        if doc.page == 1:
            draw_cover(c, doc)

    def on_inner(c, doc):
        if doc.page > 1:
            draw_header_footer(c, doc)

    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)
    inner_frame = Frame(MARGIN_L, MARGIN_B, CONTENT_W, PAGE_H - MARGIN_T - MARGIN_B - 14 * mm,
                        leftPadding=0, rightPadding=0, topPadding=10, bottomPadding=8 * mm)

    doc = BaseDocTemplate(
        OUT_PATH,
        pagesize=A4,
        pageTemplates=[
            PageTemplate(id='cover', frames=[cover_frame], onPage=on_cover),
            PageTemplate(id='inner', frames=[inner_frame], onPage=on_inner),
        ],
        title='Kinexus Export Readiness Playbook',
        author='Kinexus Systems Pvt. Ltd.',
        subject='Export Readiness — Step-by-Step Framework',
        creator='Kinexus Systems — kinexus.co.in',
    )

    # First page = cover (no content drawn; only canvas callback)
    # Second page onward = inner template
    # We need to insert the template-switch after the first PageBreak
    from reportlab.platypus import NextPageTemplate
    full_story = [NextPageTemplate('cover'), PageBreak(),
                  NextPageTemplate('inner')] + story

    doc.build(full_story)
    print(f'PDF written: {OUT_PATH}')


if __name__ == '__main__':
    build()
