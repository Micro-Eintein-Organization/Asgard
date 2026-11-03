"""Render the editable methodology paper without changing its text."""

import argparse
import re
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Preformatted

ROOT = Path(__file__).resolve().parents[2]


def render(source, target):
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle("PaperBody", fontName="Times-Roman", fontSize=10.5, leading=14,
                              spaceAfter=8, splitLongWords=True))
    styles.add(ParagraphStyle("PaperTitle", fontName="Times-Bold", fontSize=17, leading=21,
                              alignment=TA_CENTER, spaceAfter=15))
    styles.add(ParagraphStyle("PaperH2", fontName="Times-Bold", fontSize=13, leading=16,
                              spaceBefore=12, spaceAfter=7, keepWithNext=True))
    styles.add(ParagraphStyle("PaperH3", fontName="Times-Bold", fontSize=11.5, leading=14,
                              spaceBefore=8, spaceAfter=6, keepWithNext=True))
    styles.add(ParagraphStyle("PaperCell", fontName="Times-Roman", fontSize=8.8, leading=11,
                              spaceAfter=0, splitLongWords=True))
    styles.add(ParagraphStyle("Diagram", fontName="Courier", fontSize=9, leading=12, spaceAfter=10))

    def inline(text):
        text = escape(text)
        text = re.sub(r"`([^`]+)`", r'<font name="Courier">\1</font>', text)
        text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
        return re.sub(r"https?://[^\s<>]+", lambda m: '<link href="' + m[0] + '">' + m[0] + '</link>', text)

    lines = source.read_text(encoding="utf-8").splitlines()
    story, i = [], 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("```"):
            i += 1
            block = []
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(lines[i])
                i += 1
            story.append(Preformatted("\n".join(block), styles["Diagram"]))
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                cells = [x.strip() for x in lines[i].strip("|").split("|")]
                if not all(re.match(r"^:?-+:?$", c) for c in cells):
                    rows.append([Paragraph(inline(c), styles["PaperCell"]) for c in cells])
                i += 1
            widths = {3: [125, 165, 205], 4: [130, 75, 145, 145]}.get(len(rows[0]))
            table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8edf0")),
                ("LINEBELOW", (0, 0), (-1, 0), .65, colors.HexColor("#576775")),
                ("LINEBELOW", (0, 1), (-1, -1), .25, colors.HexColor("#d3d9de")),
                ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]))
            story.extend([table, Spacer(1, 10)])
            continue
        if line.startswith("#"):
            level = len(line) - len(line.lstrip("#"))
            style = "PaperTitle" if level == 1 else "PaperH2" if level == 2 else "PaperH3"
            story.append(Paragraph(inline(line.lstrip("# ")), styles[style]))
            i += 1
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("#", "|", "```")):
            paragraph.append(lines[i])
            i += 1
        story.append(Paragraph(inline(" ".join(paragraph)), styles["PaperBody"]))

    target.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(target), pagesize=A4, leftMargin=50, rightMargin=50,
                            topMargin=48, bottomMargin=48, title=lines[0].lstrip("# "),
                            author="Asgard project; research preparation draft")

    def footer(canvas, document):
        canvas.saveState()
        canvas.setFont("Times-Roman", 8)
        canvas.setFillColor(colors.HexColor("#465360"))
        canvas.drawString(50, 27, "Asgard | Dataset methodology | Review draft | 2026-11-03")
        canvas.drawRightString(A4[0] - 50, 27, str(document.page))
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=ROOT / "docs/research/dataset-methodology.md")
    parser.add_argument("--output", type=Path, default=ROOT / "output/pdf/asgard-dataset-methodology.pdf")
    args = parser.parse_args()
    render(args.source, args.output)
