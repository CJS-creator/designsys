
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('lint_results_utf8.json', 'utf8'));

const summary = {};

data.forEach(file => {
    if (file.errorCount > 0) {
        const relativePath = file.filePath.replace(/.*\\designsys\\/, '');
        summary[relativePath] = {
            errorCount: file.errorCount,
            warningCount: file.warningCount,
            errors: file.messages.filter(m => m.severity === 2).map(m => ({
                ruleId: m.ruleId,
                message: m.message,
                line: m.line
            }))
        };
    }
});

fs.writeFileSync('lint_summary.json', JSON.stringify(summary, null, 2));
console.log('Summary generated.');
