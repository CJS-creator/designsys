import { GeneratedDesignSystem } from "@/types/designSystem";

export function generateGitHubAction(ds: GeneratedDesignSystem): string {
    return `name: Design System Sync (DesignForge)

on:
  workflow_dispatch:
  # Trigger this via DesignForge Webhook in the future
  repository_dispatch:
    types: [design-system-update]

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Fetch Design Tokens
        run: |
          # In a real scenario, this would call the DesignForge API
          # For now, we use the generated sync script
          curl -X GET "https://api.designforge.ai/v1/export/${ds.id || 'current-id'}?format=json" \\
               -H "Authorization: Bearer \${{ secrets.DESIGNFORGE_TOKEN }}" \\
               -o ./tokens.json
               
      - name: Commit and Push Changes
        run: |
          git config --global user.name "DesignForge Bot"
          git config --global user.email "bot@designforge.ai"
          git add ./tokens.json
          git commit -m "chore: update design system tokens [${ds.name}]" || echo "No changes to commit"
          git push
`;
}
