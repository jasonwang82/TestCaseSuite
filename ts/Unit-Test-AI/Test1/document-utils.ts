import { ContainerUtil } from '@malagu/core';
import * as vscode from 'vscode';
import { CodeService, SplitCodeOptions } from '../code/code-protocol';
import path from 'node:path';

export namespace DocumentUtils {
    export function getTextByOffset(document: vscode.TextDocument, position: vscode.Position, offset = 25): string {
        let startOrEndLine = position.line + offset;
        if (startOrEndLine > document.lineCount - 1) {
            startOrEndLine = document.lineCount - 1;
        } else if (startOrEndLine < 0) {
            startOrEndLine = 0;
        }

        if (startOrEndLine > position.line) {
            const end = document.lineAt(startOrEndLine);
            return convertCRLFtoLF(document.getText(new vscode.Range(position, end.range.end)));
        }
        return convertCRLFtoLF(document.getText(new vscode.Range(new vscode.Position(startOrEndLine, 0), position)));
    }

    export function getBelowText(document: vscode.TextDocument, position: vscode.Position, offset = 25): string {
        return getTextByOffset(document, position, offset);
    }

    export function getAboveText(document: vscode.TextDocument, position: vscode.Position, offset = 25): string {
        return getTextByOffset(document, position, 0 - offset);
    }

    export function hasBelowText(document: vscode.TextDocument, position: vscode.Position): boolean {
        const text = getBelowText(document, position);
        return text.trim().length > 0;
    }

    export function getLineText(document: vscode.TextDocument, line: number): string {
        if (line >= 0 && line < document.lineCount) {
            return document.lineAt(line).text;
        }
        return '';
    }

    export function getCurrentLineText(document: vscode.TextDocument, position: vscode.Position): string {
        return getLineText(document, position.line);
    }

    export function getCurrentLineTextBeforePosition(document: vscode.TextDocument, position: vscode.Position): string {
        return getCurrentLineRangeText(document, new vscode.Range(new vscode.Position(position.line, 0), position));
    }

    export function getCurrentLineTextAfterPosition(document: vscode.TextDocument, position: vscode.Position): string {
        return getCurrentLineRangeText(document, new vscode.Range(position, document.lineAt(position.line).range.end));
    }

    export function getCurrentLineRangeText(document: vscode.TextDocument, range: vscode.Range): string {
        return document.getText(range);
    }

    export function split(document: vscode.TextDocument, position: vscode.Position, options?: SplitCodeOptions): { aboveCodeLines: string[]; belowCodeLines: string[] } {
        const codeService = ContainerUtil.get<CodeService>(CodeService);
        const { above, below } = codeService.split(document, new vscode.Selection(position, position), options);
        const aboveCodeLines = above.lines;
        const belowCodeLines = below.lines;
        aboveCodeLines.push(DocumentUtils.getCurrentLineTextBeforePosition(document, position));
        belowCodeLines.unshift(DocumentUtils.getCurrentLineTextAfterPosition(document, position));
        return { aboveCodeLines, belowCodeLines };
    }

    export function trimBlock(text: string): string {
        return trimBlockEnd(trimBlockStart(text));
    }

    export function trimBlockStart(text: string): string {
        const lines = text.split('\n');
        while (lines.length > 0 && lines[0].trim().length === 0) {
            lines.shift();
        }
        return lines.join('\n');
    }

    export function trimBlockEnd(text: string): string {
        const lines = text.split('\n');
        while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
            lines.pop();
        }
        return lines.join('\n');
    }

    export function getIndent(text: string): string {
        const match = text.split('\n')[0].match(/^\s+/);
        return match ? match[0] : '';
    }

    export function appendBlockIndent(text: string, indent: string): string {
        const lines = text.split('\n');
        return lines.map(line => appendIndent(line, indent)).join('\n');
    }

    export function appendIndent(lineText: string, indent: string): string {
        return indent + lineText;
    }

    export function getParentIndent(aboveText: string, indent: string): string {
        const lines = aboveText.split('\n');
        for (const line of lines.reverse()) {
            const parentIndent = getIndent(line);
            if (parentIndent.length < indent.length) {
                return parentIndent;
            }
        }
        return indent;
    }

    export function getPreIndent(aboveText: string): string {
        const lines = aboveText.split('\n');
        // 移除光标当前行
        lines.pop();
        for (const line of lines.reverse()) {
            if (line.trim()) {
                return getIndent(line);
            }
        }
        return '';
    }

    export function getPreLine(aboveText: string): string {
        const lines = aboveText.split('\n');
        // 移除光标当前行
        lines.pop();
        for (const line of lines.reverse()) {
            if (line.trim()) {
                return line;
            }
        }
        return '';
    }

    export function getNextIndent(belowText: string): string {
        const lines = belowText.split('\n');
        // 移除光标当前行
        lines.shift();
        for (const line of lines) {
            if (line.trim()) {
                return getIndent(line);
            }
        }
        return '';
    }

    export function getNextLine(belowText: string): string {
        const lines = belowText.split('\n');
        // 移除光标当前行
        lines.shift();
        for (const line of lines) {
            if (line.trim()) {
                return line;
            }
        }
        return '';
    }

    export async function getTextDocument(uri: vscode.Uri): Promise<vscode.TextDocument | undefined> {
        let textDocument = vscode.workspace.textDocuments.find(document => document.uri.toString() === uri.toString());
        if (!textDocument) {
            textDocument = await vscode.workspace.openTextDocument(uri);
        }

        return textDocument;
    }

    function getWorkspaceFolder(document: vscode.TextDocument): string | undefined {
        if (document.uri.scheme === 'untitled') {
            return;
        }

        const { fileName } = document;
        const workspaceFolders = vscode.workspace.workspaceFolders?.map(f => f.uri) ?? [];
        for (const uri of workspaceFolders) {
            const folderPath = uri.fsPath;
            if (fileName.startsWith(folderPath + path.sep)) {
                return folderPath;
            }
        }
    }

    export function getRelativePath(document: vscode.TextDocument): string | undefined {
        const workspaceFolder = getWorkspaceFolder(document);
        if (workspaceFolder) {
            return path.relative(workspaceFolder, document.fileName);
        }
        return;
    }

    export function getWorkspaceFolderName(document: vscode.TextDocument): string {
        const workspaceFolder = getWorkspaceFolder(document);
        if (workspaceFolder) {
            return path.basename(workspaceFolder);
        }
        return '';
    }

    export function convertCRLFtoLF(str: string | undefined): string {
        if (!str) {
            return '';
        }
        return str.replace(/\r\n/g, '\n').replace(/\r/g, '');
    }

    export function convertLFtoCRLF(str: string | undefined): string {
        if (!str) {
            return '';
        }
        return str.replace(/\n/g, '\r\n');
    }

    export function getLastColumnAtLine(document: vscode.TextDocument, line: number): number {
        const currentLine = document.lineAt(line);
        return currentLine.text.length;
    }
}
