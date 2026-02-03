import { Octokit } from "octokit";
import { monitor } from "../monitoring";

export interface GitSyncParams {
    accessToken: string;
    repoFullName: string;
    branch: string;
    files: { path: string; content: string }[];
    message: string;
}

export class GitHubService {
    private octokit: Octokit;

    constructor(accessToken: string) {
        this.octokit = new Octokit({ auth: accessToken });
    }

    /**
     * Pushes files to a branch and creates a PR if necessary
     */
    async syncTokens({ repoFullName, branch, files, message }: Omit<GitSyncParams, 'accessToken'>) {
        const [owner, repo] = repoFullName.split("/");
        const newBranchName = `designforge/tokens-${Date.now()}`;

        try {
            // 1. Get default branch SHA
            const { data: refData } = await this.octokit.rest.git.getRef({
                owner,
                repo,
                ref: `heads/${branch}`,
            });
            const baseSha = refData.object.sha;

            // 2. Create a new branch
            await this.octokit.rest.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${newBranchName}`,
                sha: baseSha,
            });

            // 3. Create a tree with multiple files
            const tree = await this.octokit.rest.git.createTree({
                owner,
                repo,
                base_tree: baseSha,
                tree: files.map(file => ({
                    path: file.path,
                    mode: "100644",
                    type: "blob",
                    content: file.content
                }))
            });

            // 4. Create a commit
            const { data: commitData } = await this.octokit.rest.git.createCommit({
                owner,
                repo,
                message,
                tree: tree.data.sha,
                parents: [baseSha]
            });

            // 5. Update the new branch reference
            await this.octokit.rest.git.updateRef({
                owner,
                repo,
                ref: `heads/${newBranchName}`,
                sha: commitData.sha
            });

            // 6. Create a Pull Request
            const { data: prData } = await this.octokit.rest.pulls.create({
                owner,
                repo,
                title: "🎨 Update Design Tokens [DesignForge Automation]",
                head: newBranchName,
                base: branch,
                body: "Automated synchronization of design tokens from DesignForge.\n\n### Changes\n" +
                    files.map(f => `- \`${f.path}\``).join("\n")
            });

            return { success: true, prUrl: prData.html_url };
        } catch (error: any) {
            monitor.error("GitHub Sync Error", error as Error);
            throw new Error(`Git Sync Failed: ${error.message}`);
        }
    }
}
