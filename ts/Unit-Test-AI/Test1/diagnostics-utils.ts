import * as vscode from 'vscode';
import { Deferred, timeout as setTimeout } from '@malagu/core';

export namespace DiagnosticsUtils {
    export async function wait(document: vscode.TextDocument, timeout: number, signal?: AbortSignal): Promise<vscode.Diagnostic[]> {
        const deferred = new Deferred<vscode.Diagnostic[]>();
        const diagnosticsChangeListener = vscode.languages.onDidChangeDiagnostics(async event => {
            if (event.uris.map(String).includes(document.uri.toString())) {
                const diagnostics = vscode.languages.getDiagnostics(document.uri);
                if (diagnostics.length > 0) {
                    const relevantDiagnostics = diagnostics.filter(diagnostic =>
                        diagnostic.severity === vscode.DiagnosticSeverity.Error ||
                        diagnostic.severity === vscode.DiagnosticSeverity.Warning
                    );
                    deferred.resolve(relevantDiagnostics);
                }
            } else {
                deferred.resolve([]);
            }
        });

        const cancelablePromise = setTimeout(timeout);
        cancelablePromise.then(data => {
            deferred.resolve([]);
        });

        if (signal) {
            signal.onabort = () => {
                deferred.resolve([]);
            };
        }

        const result = await deferred.promise;
        diagnosticsChangeListener.dispose();
        cancelablePromise.cancel();
        return result;
    }

    export async function getDiagnostics(document: vscode.TextDocument, range: vscode.Range): Promise<vscode.Diagnostic[]> {
        const diagnosticsList = vscode.languages
            .getDiagnostics(document.uri)
            .filter(diagnostics => !(diagnostics.range.end.line < range.start.line || diagnostics.range.start.line > range.end.line));
        return diagnosticsList;
    }

    export function getSevereDiagnostics(diagnostics: vscode.Diagnostic[]): vscode.Diagnostic[] {
        return diagnostics.filter(d => d.severity <= vscode.DiagnosticSeverity.Warning);
    }
    export function getDiagnosticsAsText(diagnostics: vscode.Diagnostic[]): string {
        return diagnostics.map(d => d.message).join(', ');
    }
}
