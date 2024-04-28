import path from 'path';
import ignore, { Ignore } from 'ignore';
import vscode, { FileType, Uri, workspace } from 'vscode';

const { fs } = workspace;

export namespace LanguageUtils {
    const excludeDirs: string[] = ['node_modules', 'vendor', 'dist', 'out', 'build'];
    const languageExtensions: Record<string, string> = {
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.py': 'Python',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C',
        '.cs': 'C#',
        '.rb': 'Ruby',
        '.go': 'Go',
        '.php': 'PHP',
        '.swift': 'Swift',
        '.m': 'Objective-C',
        '.kt': 'Kotlin',
        '.rs': 'Rust',
        '.lua': 'Lua',
        '.groovy': 'Groovy',
        '.r': 'R',
        '.dart': 'Dart',
        '.hs': 'Haskell',
        '.scala': 'Scala',
        '.pl': 'Perl',
        '.sh': 'Shell',
        '.tcl': 'Tcl',
        '.vbs': 'VBScript',
        '.vb': 'Visual Basic',
        '.f': 'Fortran',
        '.f90': 'Fortran',
        '.f95': 'Fortran',
        '.f03': 'Fortran',
        '.f08': 'Fortran',
        '.cob': 'COBOL',
        '.cbl': 'COBOL',
        '.ml': 'OCaml',
        '.mli': 'OCaml',
        '.fs': 'F#',
        '.fsx': 'F#',
        '.jsp': 'JavaServer Pages',
        '.asp': 'Active Server Pages',
        '.aspx': 'ASP.NET',
        '.erl': 'Erlang',
        '.hrl': 'Erlang',
        '.elm': 'Elm',
        '.ex': 'Elixir',
        '.exs': 'Elixir',
        '.jl': 'Julia',
        '.nim': 'Nim',
        '.v': 'V',
        '.sv': 'SystemVerilog',
        '.svh': 'SystemVerilog',
        '.vhd': 'VHDL',
        '.vhdl': 'VHDL',
        '.p': 'Prolog',
        '.pro': 'Prolog',
        '.mat': 'MATLAB',
        '.mjs': 'JavaScript (module)',
        '.cjs': 'JavaScript (CommonJS)'
    };
    const languageIdMap: Record<string, string> = {
        'c' : 'C',
        'cpp' : 'C++',
        'css' : 'CSS',
        'go' : 'Golang',
        'html' : 'HTML',
        'java' : 'Java',
        'javascript' : 'JavaScript',
        'javascriptreact' : 'React (JavaScript library)',
        'typescript' : 'TypeScript',
        'typescriptreact' : 'React (TypeScript library)',
        'python' : 'Python',
        'sql' : 'SQL',
        'markdown' : 'Markdown',
        'ruby' : 'Ruby',
        'rust' : 'Rust',
        'json' : 'JSON',
        'csharp' : 'C#',
        'kotlin' : 'Kotlin',
        'shellscript' : 'Shell Script',
        'bat' : 'Batch File (BAT)',
        'yaml' : 'YAML',
    };
    let currentFileExtensions: Record<string, number> = {};
    let workspacePath: vscode.Uri;
    let mainLanguage: string | undefined;
    let languageScanScheduleTask: NodeJS.Timer;
    let gitIgnore: Ignore | undefined;

    async function walkDir(maxScanTime: number, fileExtensions: Record<string, number>, dir: vscode.Uri) {
        // 如果当前时间超过最大扫描时间，则中止扫描，以最大扫描时间统计为准
        if (Date.now() >= maxScanTime) {
            return;
        }
        try {
            const files = await fs.readDirectory(dir);

            await Promise.allSettled(
                files.map(async file => {
                    const filePath = Uri.joinPath(dir, file[0]);
                    const fileName = path.basename(filePath.path);
                    const relativePath = path.relative(workspacePath.path, filePath.path);
                    if (gitIgnore?.ignores(relativePath)) {
                        return;
                    }
                    if (file[1] === FileType.Directory) {
                        if (!excludeDirs.includes(fileName) && !fileName.startsWith('.')) {
                            await walkDir(maxScanTime, fileExtensions, filePath);
                        }
                    } else {
                        const ext = path.extname(fileName);
                        if (ext in languageExtensions) {
                            fileExtensions[ext] = (fileExtensions[ext] ?? 0) + 1;
                        }
                    }
                })
            );
        } catch (error) {
            // NoOp
        }
    }

    async function initGitIgnore(dir: vscode.Uri) {
        const gitignorePath = vscode.Uri.joinPath(dir, '.gitignore');

        let gitignoreContent = '';
        try {
            gitignoreContent = (await vscode.workspace.fs.readFile(gitignorePath)).toString();
        } catch {
            // NoOp
        }
        gitIgnore = ignore().add(gitignoreContent);
    }

    async function scanMainLanguage(dir: vscode.Uri, timeout: number) {
        initGitIgnore(dir);
        const fileExtensions: Record<string, number> = {};
        const maxScanTime = Date.now() + timeout;
        await walkDir(maxScanTime, fileExtensions, dir);
        if (Object.keys(fileExtensions).length === 0) {
            return;
        }
        currentFileExtensions = fileExtensions;
        const sortedExtensions = Object.entries(fileExtensions).sort((a, b) => b[1] - a[1]);
        const mainExtension = sortedExtensions[0][0];
        mainLanguage = languageExtensions[mainExtension];
        // 开始定时扫描
        scheduleLanguageScans();
        return mainLanguage;
    }

    function scheduleLanguageScans() {
        if (languageScanScheduleTask) {
            return;
        }
        // 定时 5 分钟执行一次主语言的扫描，并更新 currentFileExtensions 和 mainLanguage
        // 定时扫描主要是为了解决添加或删除文件修改后，mainLanguage 不更新的问题
        languageScanScheduleTask = setInterval(() => {
            scanMainLanguage(workspacePath, 1000);
        }, 5 * 60 * 1000);
    }

    export async function getCurrentProjectMainLanguage(): Promise<string | undefined> {
        if (Object.keys(currentFileExtensions).length > 0) {
            return mainLanguage;
        }
        const { workspaceFolders } = vscode.workspace;
        // 仅单工作空间的时候才支持
        if (!workspaceFolders || workspaceFolders.length > 1) {
            return;
        }
        const folder = workspaceFolders.at(0)?.uri;
        if (!folder) {
            return;
        }
        workspacePath = folder;
        // 首次加载最多等待运行 1 秒，以 1 秒内的扫描结果来进行统计分析
        return scanMainLanguage(workspacePath, 1000);
    }

    export function getMainLanguageByLanguageId(languageId: string): string | undefined {
        return languageIdMap[languageId] || languageId;
    }
}
