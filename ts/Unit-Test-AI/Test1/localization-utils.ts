
import * as vscode from 'vscode';

export namespace LocalizationUtils {
    export function get<T>(target: T, property: keyof T): string {
        const suffix = vscode.env.language.replace('-', '').toUpperCase();
        const localizedProperty = `${String(property)}${suffix}` as keyof T;
        return (target[localizedProperty] ?? target[property] ?? '') as string;
    }
}
