import { GeneratedDesignSystem } from "@/types/designSystem";

export function generateColorSwatchesSVG(ds: GeneratedDesignSystem): string {
    const colors = Object.entries(ds.colors).filter(([_, val]) => typeof val === 'string');
    const swatchSize = 100;
    const gap = 20;
    const columns = 5;
    const padding = 40;
    const width = columns * (swatchSize + gap) - gap + (padding * 2);
    const rows = Math.ceil(colors.length / columns);
    const height = rows * (swatchSize + gap + 30) - gap + (padding * 2);

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="white" />`;
    svg += `<text x="${padding}" y="${padding - 10}" font-family="sans-serif" font-size="20" font-weight="bold">${ds.name} Color Palette</text>`;

    colors.forEach(([name, value], i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const x = padding + col * (swatchSize + gap);
        const y = padding + row * (swatchSize + gap + 30);

        svg += `<rect x="${x}" y="${y}" width="${swatchSize}" height="${swatchSize}" rx="8" fill="${value}" stroke="#eee" />`;
        svg += `<text x="${x}" y="${y + swatchSize + 15}" font-family="sans-serif" font-size="12" font-weight="bold">${name}</text>`;
        svg += `<text x="${x}" y="${y + swatchSize + 30}" font-family="sans-serif" font-size="10" fill="#666">${value}</text>`;
    });

    svg += `</svg>`;
    return svg;
}

export function generateSingleSwatchSVG(name: string, value: string): string {
    return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="white" />
  <rect x="20" y="20" width="160" height="120" rx="12" fill="${value}" stroke="#eee" />
  <text x="20" y="165" font-family="sans-serif" font-size="16" font-weight="bold">${name}</text>
  <text x="20" y="185" font-family="sans-serif" font-size="14" fill="#666">${value}</text>
</svg>`;
}

export async function renderSwatchesToPNG(ds: GeneratedDesignSystem): Promise<Blob> {
    const colors = Object.entries(ds.colors).filter(([_, val]) => typeof val === 'string');
    const swatchSize = 200;
    const gap = 40;
    const columns = 4;
    const padding = 80;
    const width = columns * (swatchSize + gap) - gap + (padding * 2);
    const rows = Math.ceil(colors.length / columns);
    const height = rows * (swatchSize + gap + 60) - gap + (padding * 2);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");

    // Background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#111';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`${ds.name} Color Palette`, padding, padding - 20);

    colors.forEach(([name, value], i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const x = padding + col * (swatchSize + gap);
        const y = padding + row * (swatchSize + gap + 60);

        // Shadow shim
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, swatchSize, swatchSize, 16);
        ctx.fill();

        // Swatch
        ctx.fillStyle = value as string;
        ctx.beginPath();
        ctx.roundRect(x, y, swatchSize, swatchSize, 16);
        ctx.fill();
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.fillStyle = '#111';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(name, x, y + swatchSize + 35);
        
        ctx.fillStyle = '#666';
        ctx.font = '20px monospace';
        ctx.fillText(value as string, x, y + swatchSize + 65);
    });

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create PNG blob"));
        }, 'image/png');
    });
}

export function generateTypographyPreviewSVG(ds: GeneratedDesignSystem): string {
    const families = [
        { label: 'Heading', value: ds.typography.fontFamily.heading },
        { label: 'Body', value: ds.typography.fontFamily.body },
        { label: 'Mono', value: ds.typography.fontFamily.mono }
    ];

    let svg = `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="white" />`;
    svg += `<text x="40" y="60" font-family="sans-serif" font-size="32" font-weight="bold">${ds.name} Typography</text>`;

    let y = 140;
    families.forEach(f => {
        svg += `<text x="40" y="${y}" font-family="sans-serif" font-size="14" fill="#666" font-weight="bold">${f.label.toUpperCase()}</text>`;
        svg += `<text x="40" y="${y + 45}" font-family="'${f.value}', sans-serif" font-size="36">${f.value}</text>`;
        svg += `<text x="40" y="${y + 80}" font-family="'${f.value}', sans-serif" font-size="20">The quick brown fox jumps over the lazy dog.</text>`;
        y += 150;
    });

    svg += `</svg>`;
    return svg;
}
