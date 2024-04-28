/* eslint-disable @typescript-eslint/no-explicit-any */
import * as vscode from 'vscode';
import { CONFIGURATION_SECTION, CONFIGURATION_AI_SECTION } from './constants';

export namespace ConfigUtils {

    export function get<T = string>(key: string, defaultValue?: T): T | undefined {
        return vscode.workspace.getConfiguration(CONFIGURATION_SECTION).get<T>(key) ?? defaultValue;
    }

    export function getAI<T = string>(key: string, defaultValue?: T): T | undefined {
        return vscode.workspace.getConfiguration(CONFIGURATION_AI_SECTION).get<T>(key) ?? defaultValue;
    }

    export function getAll(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(CONFIGURATION_SECTION);
    }

    export function update(
        key: string, value: any, configurationTarget?: boolean | vscode.ConfigurationTarget | null | undefined, overrideInLanguage?: boolean | undefined): Thenable<void> {
        return vscode.workspace.getConfiguration(CONFIGURATION_SECTION).update(key, value, configurationTarget);
    }

    export function updateAI(
        key: string, value: any, configurationTarget?: boolean | vscode.ConfigurationTarget | null | undefined, overrideInLanguage?: boolean | undefined): Thenable<void> {
        return vscode.workspace.getConfiguration(CONFIGURATION_AI_SECTION).update(key, value, configurationTarget);
    }

    export function getApplicationConfig(): Record<string, any> {
        return {
            malagu: {
                client: {
                    config: {
                        proxy: false
                    }
                }
            }
        };
    }
}
