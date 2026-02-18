/**
 * Simple BM25 Implementation for offline search
 */
export class BM25 {
    private documents: Map<string, string>; // ID -> Text
    private docLengths: Map<string, number>; // ID -> Length
    private avgDocLength: number;
    private idf: Map<string, number>; // Term -> IDF
    private k1: number = 1.5;
    private b: number = 0.75;

    constructor(documents: Record<string, string> = {}) {
        this.documents = new Map(Object.entries(documents));
        this.docLengths = new Map();
        this.idf = new Map();
        this.avgDocLength = 0;

        if (Object.keys(documents).length > 0) {
            this.index();
        }
    }

    /**
     * Add a document to the index
     */
    addDocument(id: string, text: string): void {
        this.documents.set(id, text);
    }

    /**
     * Build the index
     */
    index(): void {
        let totalLength = 0;
        const docCount = this.documents.size;
        const termDocCounts = new Map<string, number>();

        // Calculate document lengths and term frequencies
        for (const [id, text] of this.documents) {
            const terms = this.tokenize(text);
            this.docLengths.set(id, terms.length);
            totalLength += terms.length;

            const uniqueTerms = new Set(terms);
            for (const term of uniqueTerms) {
                termDocCounts.set(term, (termDocCounts.get(term) || 0) + 1);
            }
        }

        this.avgDocLength = totalLength / docCount;

        // Calculate IDF
        for (const [term, count] of termDocCounts) {
            // IDF variant: log(1 + (N - n + 0.5) / (n + 0.5))
            const idf = Math.log(1 + (docCount - count + 0.5) / (count + 0.5));
            this.idf.set(term, Math.max(idf, 0)); // Ensure non-negative
        }
    }

    /**
     * Search for documents matching the query
     */
    search(query: string, limit: number = 10): { id: string; score: number }[] {
        const queryTerms = this.tokenize(query);
        const scores = new Map<string, number>();

        for (const [id, text] of this.documents) {
            let score = 0;
            const docTerms = this.tokenize(text);
            const docLen = this.docLengths.get(id) || 0;

            for (const term of queryTerms) {
                if (!this.idf.has(term)) continue;

                const termFreq = docTerms.filter(t => t === term).length;
                const idf = this.idf.get(term) || 0;

                const numerator = termFreq * (this.k1 + 1);
                const denominator = termFreq + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));

                score += idf * (numerator / denominator);
            }

            if (score > 0) {
                scores.set(id, score);
            }
        }

        return Array.from(scores.entries())
            .map(([id, score]) => ({ id, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    private tokenize(text: string): string[] {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(t => t.length > 0);
    }
}
