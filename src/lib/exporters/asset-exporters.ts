import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } from "docx";
import * as htmlToImage from 'html-to-image';
import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";

/**
 * PDF Exporter
 */
export async function exportToPDF(ds: GeneratedDesignSystem, tokens: DesignToken[]): Promise<Blob> {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(ds.name, margin, y);
    y += 10;

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Design System Specification", margin, y);
    y += 15;

    // Description
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const desc = doc.splitTextToSize(ds.description || "A comprehensive design system created with DesignForge.", 170);
    doc.text(desc, margin, y);
    y += desc.length * 7 + 10;

    // Colors Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Color Palette", margin, y);
    y += 10;

    const colorTokens = tokens.filter(t => (t as any).token_type === 'color' || t.type === 'color');
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    for (const color of colorTokens) {
        if (y > 270) {
            doc.addPage();
            y = margin;
        }

        // Draw color swatch
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(String(color.value));
        doc.rect(margin, y - 5, 8, 8, 'FD');

        doc.text(`${color.name} (${color.path})`, margin + 12, y);
        doc.setFont("courier", "normal");
        doc.text(String(color.value), margin + 110, y);
        doc.setFont("helvetica", "normal");

        y += 10;
    }

    y += 10;

    // Typography
    if (y > 250) {
        doc.addPage();
        y = margin;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Typography", margin, y);
    y += 10;

    const typographyData = [
        ["Font (Heading)", ds.typography.fontFamily.heading],
        ["Font (Body)", ds.typography.fontFamily.body],
        ["Scale (Base)", ds.typography.sizes.base]
    ];

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    typographyData.forEach(([label, value]) => {
        doc.text(label, margin, y);
        doc.text(value, margin + 40, y);
        y += 7;
    });

    return doc.output('blob');
}

/**
 * Word Exporter (.docx)
 */
export async function exportToWord(ds: GeneratedDesignSystem, tokens: DesignToken[]): Promise<Blob> {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: ds.name,
                    heading: HeadingLevel.TITLE,
                }),
                new Paragraph({
                    text: "Design System Specification",
                    heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: ds.description || "A comprehensive design system created with DesignForge.",
                            italics: true,
                        }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 400 } }),

                new Paragraph({
                    text: "Color Palette",
                    heading: HeadingLevel.HEADING_1,
                }),

                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "Token Name", style: "bold" })] }),
                                new TableCell({ children: [new Paragraph({ text: "Path", style: "bold" })] }),
                                new TableCell({ children: [new Paragraph({ text: "Value", style: "bold" })] }),
                            ],
                        }),
                        ...tokens.filter(t => (t as any).token_type === 'color' || t.type === 'color').map(color => (
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(color.name)] }),
                                    new TableCell({ children: [new Paragraph(color.path)] }),
                                    new TableCell({
                                        children: [new Paragraph(String(color.value))],
                                        shading: { fill: String(color.value).replace('#', ''), type: ShadingType.CLEAR }
                                    }),
                                ],
                            })
                        ))
                    ],
                }),
            ],
        }],
    });

    return await Packer.toBlob(doc);
}

/**
 * Image Exporter (PNG/JPG/SVG/WebP)
 */
export async function exportToImage(elementId: string, format: 'png' | 'jpg' | 'svg' | 'webp' = 'png'): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element ${elementId} not found`);

    switch (format) {
        case 'png': return await htmlToImage.toPng(element);
        case 'jpg': return await htmlToImage.toJpeg(element);
        case 'svg': return await htmlToImage.toSvg(element);
        case 'webp': return await htmlToImage.toPixelData(element).then(() => htmlToImage.toPng(element)); // Fallback or use canvas
        default: return await htmlToImage.toPng(element);
    }
}
