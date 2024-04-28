import vscode from 'vscode';
import { ExtraParam } from '../langchain/llm/llm-protocol';
import { DocumentUtils } from './document-utils';

export namespace ExtraUtils {
    const EXTRA_PARAM_REPO_NAME = 'repoName';
    const EXTRA_PARAM_FILE_NAME = 'fileName';
    export async function getExtra(document: vscode.TextDocument): Promise<ExtraParam[]> {
        return [
            {
                name: EXTRA_PARAM_REPO_NAME,
                value: DocumentUtils.getWorkspaceFolderName(document)
            },
            {
                name: EXTRA_PARAM_FILE_NAME,
                value: DocumentUtils.getRelativePath(document) ?? ''
            }
        ];
    }
}
