import jsPDF from "jspdf";
import { GeneratedDesignSystem } from "@/types/designSystem";

/**
 * One-click PDF export of a generated design system.
 * Renders Colors, Typography, Spacing, Shadows, Border Radius and Grid sections.
 * Returns the generated jsPDF instance (already saved to disk).
 */
export function exportDesignSystemToPdf(ds: GeneratedDesignSystem, filename?: string): jsPDF {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      pdf.addPage();
      y = margin;
    }
  };

  const title = (text: string) => {
    ensureSpace(40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(20, 20, 20);
    pdf.text(text, margin, y);
    y += 24;
    pdf.setDrawColor(220);
    pdf.line(margin, y, pageW - margin, y);
    y += 14;
  };

  const sub = (text: string) => {
    ensureSpace(22);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text(text, margin, y);
    y += 16;
  };

  const body = (text: string) => {
    ensureSpace(16);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(text, margin, y);
    y += 14;
  };

  // ---- Cover ----
  pdf.setFillColor(245, 245, 250);
  pdf.rect(0, 0, pageW, pageH, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(34);
  pdf.setTextColor(20, 20, 30);
  pdf.text(ds.name || "Design System", margin, pageH / 2 - 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(110, 110, 120);
  pdf.text("Design System Export · DesignForge", margin, pageH / 2 + 4);
  pdf.text(new Date().toLocaleDateString(), margin, pageH / 2 + 22);
  pdf.addPage();
  y = margin;

  // ---- Colors ----
  title("Colors");
  const swatchSize = 56;
  const swatchGap = 12;
  const perRow = 4;
  const flatColors = Object.entries(ds.colors).filter(([, v]) => typeof v === "string") as [string, string][];
  let col = 0;
  let rowStartY = y;
  for (const [name, hex] of flatColors) {
    if (col === 0) {
      ensureSpace(swatchSize + 30);
      rowStartY = y;
    }
    const x = margin + col * (swatchSize + swatchGap + 70);
    const rgb = hexToRgb(hex);
    if (rgb) pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    else pdf.setFillColor(200, 200, 200);
    pdf.setDrawColor(220);
    pdf.roundedRect(x, rowStartY, swatchSize, swatchSize, 6, 6, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(40, 40, 40);
    pdf.text(name, x + swatchSize + 6, rowStartY + 16);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(110, 110, 110);
    pdf.text(hex, x + swatchSize + 6, rowStartY + 30);

    col++;
    if (col >= perRow) {
      col = 0;
      y = rowStartY + swatchSize + 18;
    }
  }
  if (col !== 0) y = rowStartY + swatchSize + 18;
  y += 10;

  // ---- Typography ----
  pdf.addPage(); y = margin;
  title("Typography");
  sub(`Heading: ${ds.typography.fontFamily.heading}`);
  sub(`Body: ${ds.typography.fontFamily.body}`);
  sub(`Mono: ${ds.typography.fontFamily.mono}`);
  y += 6;
  sub("Type Scale");
  for (const [k, v] of Object.entries(ds.typography.sizes)) {
    const pxSize = parseFloat(String(v)) || 14;
    const pt = Math.min(36, Math.max(8, Math.round(pxSize * 0.75)));
    ensureSpace(pt + 12);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(pt);
    pdf.setTextColor(30, 30, 30);
    pdf.text(`${k} — The quick brown fox`, margin, y + pt);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(140);
    pdf.text(String(v), pageW - margin - 60, y + pt);
    y += pt + 10;
  }

  // ---- Spacing ----
  pdf.addPage(); y = margin;
  title("Spacing");
  body(`Base unit: ${ds.spacing.unit}px`);
  y += 4;
  const baseY = y + 60;
  let sx = margin;
  for (const [k, v] of Object.entries(ds.spacing.scale).slice(0, 12)) {
    const px = parseFloat(String(v)) || 0;
    const h = Math.min(60, Math.max(2, px));
    pdf.setFillColor(60, 80, 200);
    pdf.rect(sx, baseY - h, 18, h, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(120);
    pdf.text(k, sx, baseY + 12);
    pdf.text(String(v), sx, baseY + 22);
    sx += 30;
    if (sx > pageW - margin - 30) {
      sx = margin;
      y = baseY + 40;
    }
  }
  y = baseY + 40;

  // ---- Shadows ----
  pdf.addPage(); y = margin;
  title("Shadows");
  for (const [k, v] of Object.entries(ds.shadows)) {
    if (k === "none") continue;
    ensureSpace(60);
    pdf.setDrawColor(230);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, y, 120, 40, 6, 6, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(30);
    pdf.text(k, margin + 140, y + 16);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(120);
    pdf.text(String(v), margin + 140, y + 30, { maxWidth: pageW - margin - 160 });
    y += 56;
  }

  // ---- Border Radius ----
  pdf.addPage(); y = margin;
  title("Border Radius");
  let rx = margin;
  const ry = y + 10;
  for (const [k, v] of Object.entries(ds.borderRadius)) {
    if (k === "none") continue;
    const r = Math.min(28, parseFloat(String(v)) || 4);
    pdf.setFillColor(60, 80, 200);
    pdf.roundedRect(rx, ry, 56, 56, r, r, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(80);
    pdf.text(`${k} (${v})`, rx, ry + 70);
    rx += 80;
    if (rx > pageW - margin - 60) { rx = margin; }
  }
  y = ry + 100;

  // ---- Grid ----
  ensureSpace(120);
  title("Grid");
  body(`Columns: ${ds.grid.columns}`);
  body(`Gutter: ${ds.grid.gutter}`);
  body(`Margin: ${ds.grid.margin}`);
  body(`Max width: ${ds.grid.maxWidth}`);
  sub("Breakpoints");
  for (const [k, v] of Object.entries(ds.grid.breakpoints)) {
    body(`${k}: ${v}`);
  }

  const safeName = (filename || `${ds.name || "design-system"}.pdf`).replace(/\s+/g, "-").toLowerCase();
  pdf.save(safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`);
  return pdf;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
