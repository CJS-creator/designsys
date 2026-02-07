import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";
import { exportToPDF, exportToWord } from "./asset-exporters";
import { exportToDTCG } from "./dtcg";
import { exportToVSCodeSnippets } from "./vscode-snippets";

interface BulkExportOptions {
    onProgress?: (percent: number) => void;
}

/**
 * Packaging Engine
 * Categorizes elements into code, docs, and assets.
 */
export async function generateBulkBundle(
    ds: GeneratedDesignSystem,
    tokens: DesignToken[],
    options: BulkExportOptions = {}
): Promise<Blob> {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const totalSteps = 6;
    let currentStep = 0;

    const updateProgress = () => {
        currentStep++;
        if (options?.onProgress) {
            options.onProgress(Math.round((currentStep / totalSteps) * 100));
        }
    };

    // 1. Documentation Folder
    const docs = zip.folder("documentation");
    if (docs) {
        const pdfBlob = await exportToPDF(ds, tokens);
        docs.file(`${ds.name}-specification.pdf`, pdfBlob);
        updateProgress();

        const wordBlob = await exportToWord(ds, tokens);
        docs.file(`${ds.name}-specification.docx`, wordBlob);
        updateProgress();
    }

    // 2. Code Folder
    const code = zip.folder("code");
    if (code) {
        // Raw JSON
        code.file("tokens.json", JSON.stringify(tokens, null, 2));

        // DTCG Standard
        const dtcg = exportToDTCG(tokens);
        code.file("tokens.dtcg.json", dtcg);
        updateProgress();

        // Snippets
        const snippets = exportToVSCodeSnippets(ds);
        code.file("designforge.code-snippets", snippets);
        updateProgress();
    }

    // 3. Metadata
    zip.file("manifest.json", JSON.stringify({
        name: ds.name,
        exportedAt: new Date().toISOString(),
        version: "v1.0.0",
        author: "DesignForge"
    }, null, 2));
    updateProgress();

    // Finalize
    const content = await zip.generateAsync({ type: "blob" });
    updateProgress();

    return content;
}
