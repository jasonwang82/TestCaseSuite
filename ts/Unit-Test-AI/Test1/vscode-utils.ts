import path from 'node:path';
import { ContainerUtil } from '@malagu/core';
import { readFileSync, existsSync } from 'node:fs';
import vscode from 'vscode';
import { localize } from 'vscode-nls-i18n';
import { ExtensionContext } from './extension-context';

export * from './proposals-utils';
export * from './git-utils';
export * from './vscode-utils';

export interface IProductConfiguration {
    readonly quality?: 'stable' | 'insider';
    readonly nameShort: string;
    readonly dataFolderName: string;
    extensionEnabledApiProposals: Record<string, string[] | undefined>;
}

enum Location {
    top_left = 0,
    top_center,
    top_right,
    center_left,
    center_center,
    center_right,
    bottom_left,
    bottom_center,
    bottom_right
}

export namespace VSCodeUtils {
    /**
     * Retrieves the product configuration.
     * @returns The product configuration object or undefined if the product.json file does not exist.
     */
    export function getProductConfiguration(): IProductConfiguration | undefined {
        const productPath = path.join(vscode.env.appRoot, 'product.json');

        if (!existsSync(productPath)) {
            return;
        }

        return JSON.parse(readFileSync(productPath).toString('utf-8'));
    }

    export async function getWorkspaceFolder(options?: vscode.QuickPickOptions): Promise<vscode.Uri | undefined> {
        const { workspaceFolders } = vscode.workspace;
        if (!workspaceFolders) {
            return;
        }

        if (workspaceFolders.length > 1) {
            const items: Array<vscode.QuickPickItem & { uri: vscode.Uri }> = workspaceFolders.map(item => ({ label: item.name, uri: item.uri }));

            const workspace = await vscode.window.showQuickPick(items, options || { title: localize('workspace.tip.select'), ignoreFocusOut: true });

            if (!workspace) {
                throw new Error(localize('workspace.tip.select'));
            }

            return workspace?.uri;
        }

        return workspaceFolders.at(0)?.uri;
    }

    export function loadCoreNodeUnpackFile(...filePath: string[]): string {
        return path.join(vscode.env.appRoot, getModuleFolder('node_modules.asar.unpacked'), ...filePath);
    }

    export function loadCoreNodeModule<T>(moduleName: string): T | undefined {
        return loadModule<T>(getModuleFolder('node_modules.asar'), moduleName);
    }

    function getModuleFolder(defaultFolder: string): string {
        const ctx = ContainerUtil.get<vscode.ExtensionContext>(ExtensionContext);
        return ctx.extension.extensionKind === vscode.ExtensionKind.Workspace || process.env.VSCODE_DEV === '1' ? 'node_modules' : defaultFolder;
    }

    function loadModule<T>(...moduleName: string[]): T | undefined {
        try {
            /* eslint-disable import/no-dynamic-require */
            return require(path.join(vscode.env.appRoot, ...moduleName));
        } catch {
            // NoOp
        }
    }

    /**
     * @description 按照行 + 列方式计算位置；
     * 行首0，中间3，尾行6；
     * 列首0，中间1，尾列2。
     * @example
     * 比如尾行列首则表示 6+0 为 bottom_left；
     * 比如尾行列尾则表示 6+2 为 bottom_right；
     */
    export function getPositionRelativeDocumentLocation(document: vscode.TextDocument, position: vscode.Position): Location {
        let { lineCount } = document;
        lineCount -= 1;

        let code = 0;
        const diffLine = lineCount - position.line;
        if (diffLine === 0) {
            code += position.line === 0 ? 0 : 6;
        } else {
            code += position.line === 0 ? 0 : 3;
        }

        const { character } = document.lineAt(position.line).range.end;
        const diffCharacter = character - position.character;
        if (diffCharacter === 0) {
            code += position.character === 0 ? 0 : 2;
        } else {
            code += 1;
        }

        return Location[code as unknown as keyof typeof Location];
    }

    export function isSupportCodeCompletion(document?: vscode.TextDocument): boolean {
        if (!document) {
            return false;
        }
        return true;
    }

    export function isDevelopment(): boolean {
        return ContainerUtil.get<vscode.ExtensionContext>(ExtensionContext).extensionMode === vscode.ExtensionMode.Development;
    }
}
