import vscode from 'vscode';
import { GitExtension, Repository } from '../types/git';

export namespace GitUtils {

    function getGitExtension() {
        const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
        const gitExtension = vscodeGit && vscodeGit.exports;
        return gitExtension && gitExtension.getAPI(1);
    }

    export function getRepo(uri?: vscode.SourceControl): Repository | undefined {
        const git = getGitExtension();

        if (!git) {
            return;
        }

        if (uri) {
            const uriPath = uri.rootUri?.path;
            return git.repositories.find(r => r.rootUri.path === uriPath);
        }

        if (git.repositories.length === 1) {
            return git.repositories[0];
        }

        if (git.repositories.length > 1) {
            return git.repositories[0];
        }
    }

}

