import dayjs from 'dayjs';
import { parse } from 'jsonc-parser/lib/esm/impl/parser';
import { exec, spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import vscode, { ExtensionKind } from 'vscode';
import { IProductConfiguration, VSCodeUtils } from './vscode-utils';

export namespace ProposalsUtils {
    export async function isCloudStudioCore(): Promise<boolean> {
        return (await vscode.commands.getCommands()).includes('cloudstudio.getBrowserUrl');
    }

    export async function checkProposedApiEnabled(context: vscode.ExtensionContext): Promise<boolean> {
        if (VSCodeUtils.isDevelopment()) {
            return true;
        }

        // 当插件安装在远端，无法直接判断插件是否支持实验性 API，需要尝试调用实验性 API 进行尝试
        if (context.extension.extensionKind === ExtensionKind.Workspace) {
            try {
                const disposable = vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, {
                    provideInlineCompletionItems: () => [],
                    handleDidPartiallyAcceptCompletionItem: () => { /* NoOp */ },
                });
                disposable.dispose();
                console.log('checkProposedApiEnabled true');
                return true;
            } catch (error) {
                console.log('checkProposedApiEnabled false');
                // 报错则认定为实验性 API 且为开启
                return false;
            }
        }

        const argv = getArgvConfig();
        return argv?.['enable-proposed-api']?.includes(context.extension.id) ?? false;
    }

    export async function patchEnabledApiProposals(context: vscode.ExtensionContext): Promise<void> {
        const product = VSCodeUtils.getProductConfiguration()!;
        const { id } = context.extension;
        const argvConfigPath = getArgvConfigPath(product);
        const argv = getArgvConfig(product);
        argv['enable-proposed-api'] = argv['enable-proposed-api'] || [];
        if (!argv['enable-proposed-api'].includes(id)) {
            argv['enable-proposed-api'].push(id);
        }
        writeFileSync(argvConfigPath, JSON.stringify(argv, undefined, '  '));
        restart();
    }

    function getArgvConfig(product?: IProductConfiguration): { 'enable-proposed-api': string[] | undefined; nameShort: string } {
        if (!product) {
            product = VSCodeUtils.getProductConfiguration()!;
        }
        const argvConfigPath = getArgvConfigPath(product);
        return parse(readFileSync(argvConfigPath).toString('utf-8'), undefined, { disallowComments: true });
    }

    function getArgvConfigPath(product: IProductConfiguration): string {
        let argvConfigPath!: string;
        const vscodePortable = process.env['VSCODE_PORTABLE'];

        if (vscodePortable) {
            argvConfigPath = join(vscodePortable, 'argv.json');
        } else {
            let dataFolderName = product.dataFolderName;
            if (process.env['VSCODE_DEV']) {
                dataFolderName = `${dataFolderName}-dev`;
            }
            argvConfigPath = join(homedir(), dataFolderName, 'argv.json');
        }

        if (!existsSync(argvConfigPath)) {
            writeFileSync(argvConfigPath, '{"enable-proposed-api":[]}');
        }

        return argvConfigPath;
    }

    function restart() {
        // TOD linux 下重启测试
        if (process.platform === 'win32') {
            restartWin();
        } else {
            spawn(`sleep 3 && '${resolve(vscode.env.appRoot, 'bin', 'code')}'`, {
                shell: true,
                detached: true,
                stdio: 'ignore'
            });
            process.kill(process.ppid, 'SIGKILL');
        }
    }

    function restartWin() {
        const { nameShort } = VSCodeUtils.getProductConfiguration()!;
        const executableFileName = `${nameShort}.exe`;

        const command = `schtasks /Create /TN vscode-restart /XML "${createJobXML(executableFileName)}" -F`;
        exec(command);

        exec(`taskkill /F /IM "${executableFileName}"`);
    }

    function createJobXML(executableFileName: string) {
        const codePath = vscode.env.appRoot.split(sep);
        codePath.splice(-2, 2);
        codePath.push(executableFileName);

        const xml = `
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
    <Triggers>
        <TimeTrigger>
            <StartBoundary>${dayjs().add(3, 'second').format()}</StartBoundary>
            <Enabled>true</Enabled>
        </TimeTrigger>
    </Triggers>
    <Actions Context="Author">
    <Exec>
        <Command>cmd</Command>
        <Arguments>/c start "" "${codePath.join(sep)}"</Arguments>
    </Exec>
    </Actions>
</Task>`;
        const xmlPath = join(tmpdir(), 'start.xml');
        writeFileSync(xmlPath, xml.trim(), 'utf-8');

        return xmlPath;
    }
}
