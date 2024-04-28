import { ChatType } from '../slash/slash-protocol';
import { COMMAND_ID_PREFIX, EXTENSION_NAME } from './constants';
import { VersionUtils } from './version-utils';
import * as vscode from 'vscode';

export namespace CommonUtils {
    export const DEFAULT_API_KEY = 'managed';
    export function generateKeyName(): string {
        return 'ai-api-key';
    }

    export function getCommandId(command: string): string {
        return `${COMMAND_ID_PREFIX}${command}`;
    }

    export function supportChatType(source: ChatType, target: ChatType): boolean {
        if (source === ChatType.All) {
            return true;
        } else if (source === target) {
            return true;
        }
        return false;
    }

    export function getLanguageCommentMarkers(languageId: string): { start: string; end: string } {
        const markers: { [key: string]: { start: string; end: string } } = {
            abap: { start: '"', end: '' },
            bat: { start: 'REM', end: '' },
            bibtex: { start: '%', end: '' },
            blade: { start: '#', end: '' },
            c: { start: '//', end: '' },
            clojure: { start: ';', end: '' },
            coffeescript: { start: '//', end: '' },
            cpp: { start: '//', end: '' },
            csharp: { start: '//', end: '' },
            css: { start: '/*', end: '*/' },
            dart: { start: '//', end: '' },
            dockerfile: { start: '#', end: '' },
            elixir: { start: '#', end: '' },
            erb: { start: '<%#', end: '%>' },
            erlang: { start: '%', end: '' },
            fsharp: { start: '//', end: '' },
            go: { start: '//', end: '' },
            groovy: { start: '//', end: '' },
            haml: { start: '-#', end: '' },
            handlebars: { start: '{{!', end: '}}' },
            haskell: { start: '--', end: '' },
            html: { start: '\x3c!--', end: '--\x3e' },
            ini: { start: ';', end: '' },
            java: { start: '//', end: '' },
            javascript: { start: '//', end: '' },
            javascriptreact: { start: '//', end: '' },
            jsonc: { start: '//', end: '' },
            jsx: { start: '//', end: '' },
            julia: { start: '#', end: '' },
            kotlin: { start: '//', end: '' },
            latex: { start: '%', end: '' },
            less: { start: '//', end: '' },
            lua: { start: '--', end: '' },
            makefile: { start: '#', end: '' },
            markdown: { start: '[]: #', end: '' },
            'objective-c': { start: '//', end: '' },
            'objective-cpp': { start: '//', end: '' },
            perl: { start: '#', end: '' },
            php: { start: '//', end: '' },
            powershell: { start: '#', end: '' },
            pug: { start: '//', end: '' },
            python: { start: '#', end: '' },
            ql: { start: '//', end: '' },
            r: { start: '#', end: '' },
            razor: { start: '\x3c!--', end: '--\x3e' },
            ruby: { start: '#', end: '' },
            rust: { start: '//', end: '' },
            sass: { start: '//', end: '' },
            scala: { start: '//', end: '' },
            scss: { start: '//', end: '' },
            shellscript: { start: '#', end: '' },
            slim: { start: '/', end: '' },
            solidity: { start: '//', end: '' },
            sql: { start: '--', end: '' },
            stylus: { start: '//', end: '' },
            svelte: { start: '\x3c!--', end: '--\x3e' },
            swift: { start: '//', end: '' },
            terraform: { start: '#', end: '' },
            tex: { start: '%', end: '' },
            typescript: { start: '//', end: '' },
            typescriptreact: { start: '//', end: '' },
            vb: { start: "'", end: '' },
            verilog: { start: '//', end: '' },
            'vue-html': { start: '\x3c!--', end: '--\x3e' },
            vue: { start: '//', end: '' },
            xml: { start: '\x3c!--', end: '--\x3e' },
            xsl: { start: '\x3c!--', end: '--\x3e' },
            yaml: { start: '#', end: '' }
        };
        if (languageId in markers) {
            return markers[languageId];
        }
        return {
            start: '//',
            end: ''
        };
    }

    export function createCodeBlock(title: string, content: string, trimContent = true): string {
        const codeBlocks = content.matchAll(/^\s*(```+)/gm);
        const maxBackticks = Math.max(3, ...Array.from(codeBlocks, match => match[1].length + 1));
        const backticks = '`'.repeat(maxBackticks);

        return `${backticks}${title}\n${trimContent ? content.trim() : content}\n${backticks}`;
    }

    export function extractFirstCodeBlock(str: string): string {
        const lines = str.split(/\r\n|\r|\n/g);
        let inCodeBlock = false;
        const codeBlocks: string[] = [];

        for (const line of lines) {
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    if (codeBlocks[0]?.includes(' FILEPATH: ')) {
                        codeBlocks.shift();
                    }
                    return codeBlocks.join('\n');
                }
                inCodeBlock = true;
            } else if (inCodeBlock) {
                if (line.match(/ BEGIN: [\d\w]*/)) {
                    continue;
                }
                if (line.match(/ END: [\d\w]*/)) {
                    continue;
                }
                codeBlocks.push(line);
            }
        }

        return codeBlocks.join('');
    }

    export function getEndpoint(product: string): string {
        const env = process.env.TENCENT_CLOUDAPI_ENV;
        return `${product}${env ? `.${env}` : ''}.tencentcloudapi.com`;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    export function parseCompletionData(data: string): any {
        const parts = data
            .replace(/^data:\s/, '')
            .replace(/\n\ndata: \[DONE\]\n\n$/, '')
            .split('\n\ndata: ');
        let text = '';
        let partObj: any;
        for (const part of parts) {
            partObj = JSON.parse(part);
            text += partObj.choices[0].text;
        }
        partObj.choices[0].text = text;
        return partObj;
    }

    /**
     * 为了兼容同一命令在 VSCode 不同版本时 Command ID 的变化，重写 vscode.commands.executeCommand
     */
    export function rewriteExecuteCommandFn(): void {
        const originalFn = vscode.commands.executeCommand;
        vscode.commands.executeCommand = async <T>(command: string, ...args: any[]): Promise<T> => {
            const COMMAND_MAP: Record<string, { old: string; new: string }> = {
                [`workbench.action.chat.${EXTENSION_NAME}.clear`]: {
                    old: `workbench.action.chat.${EXTENSION_NAME}.clear`,
                    new: `workbench.action.chat.${EXTENSION_NAME}.newChat`
                },
                'workbench.action.chat.clear': {
                    old: 'workbench.action.chat.clear',
                    new: 'workbench.action.chat.newChat'
                }
            };

            const useNewProposal = VersionUtils.greaterThanOrEqualTo(vscode.version, '1.86.0');
            const finalCommand = COMMAND_MAP[command] ? (useNewProposal ? COMMAND_MAP[command].new : COMMAND_MAP[command].old) : command;
            return originalFn.call(vscode.commands, finalCommand, ...args);
        };
    }

    export function getContentLines(content: string, separator = '\n'): number {
        const lines = content.split(separator).length;

        /**
         * edge case: 以 'a\nb\n' 为例
         * JS 语言中，split得到的结果为3，在Java语言中得到的结果为2
         * 这里和java对齐
         */
        return content.endsWith(separator) ? lines - 1 : lines;
    }
}
