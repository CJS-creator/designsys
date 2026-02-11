/**
 * CSV Parser for UI UX Pro Max Data Files
 */

export interface CSVRow {
    [key: string]: string;
}

export interface ParsedCSV {
    headers: string[];
    rows: CSVRow[];
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

/**
 * Parse CSV content into structured data
 */
export function parseCSV(content: string): ParsedCSV {
    const lines = content.trim().split('\n');
    if (lines.length === 0) {
        return { headers: [], rows: [] };
    }

    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        return headers.reduce((row: Record<string, string>, header, i) => {
            row[header] = values[i] || '';
            return row;
        }, {});
    });

    return { headers, rows };
}

/**
 * Load and parse a CSV file
 * Note: This is a server-side function. For client-side, use the pre-parsed data
 */
export async function loadCSV(filename: string): Promise<ParsedCSV> {
    try {
        const response = await fetch(`/data/ui-ux-pro-max/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        const content = await response.text();
        return parseCSV(content);
    } catch (error) {
        console.error(`Error loading CSV ${filename}:`, error);
        return { headers: [], rows: [] };
    }
}

/**
 * Load CSV from public directory (for client-side usage)
 */
export function loadCSVClient(filename: string): ParsedCSV | null {
    try {
        // For client-side, we'll need to have the data bundled or use fetch
        // This is a placeholder - actual implementation depends on build setup
        return null;
    } catch (error) {
        console.error(`Error loading CSV ${filename}:`, error);
        return null;
    }
}
