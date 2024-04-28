import { APP_DISPLAY_NAME } from './constants';
import { CHAT_BASE_PROMPT, SAFETY_RULES, VSCODE_PROMPT, getChatLanguagePrompt } from '../prompt/prompt-protocol';
import { localize } from 'vscode-nls-i18n';
import { locale, SCOPE } from '@/ai-i18n';
import { BaseMessage, SystemMessage, HumanMessage, AIMessage } from 'langchain/schema';
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';
import { HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts';
import { BaseMessagePromptTemplate } from 'langchain/dist/prompts/chat';
import { LanguageUtils } from './language-utils';
import * as vscode from 'vscode';
import path from 'node:path';
import { ChatMessage, ChatMessageRole } from '@/chat/chat-protocol';

export namespace MessageUtils {
    export function render(content: string): string {
        const document = vscode.window.activeTextEditor?.document;
        return content
            .replace(new RegExp('{name}', 'g'), localize('displayName'))
            .replace(new RegExp('{country}', 'g'), localize('country'))
            .replace(new RegExp('{company}', 'g'), localize('company'))
            .replace(new RegExp('{language}', 'g'), document?.languageId ?? '')
            .replace(new RegExp('{file}', 'g'), path.basename(document?.fileName ?? ''))
            .replace(new RegExp('{filePath}', 'g'), document?.fileName ?? '')
            .replace(new RegExp('{locale}', 'g'), locale(SCOPE.MODEL_RESPONSE))
            .replace(new RegExp('{hostName}', 'g'), vscode.env.appName);
    }

    export function toMessages(humanMessage?: string | string[], systemMessage?: string | string[]): BaseMessage[] {
        return [...toSystemMessages(systemMessage), ...toHumanMessages(humanMessage)];
    }

    export function toHumanMessage(humanMessage: string | string[]): HumanMessage {
        return new HumanMessage(Array.isArray(humanMessage) ? humanMessage.join('\n') : humanMessage);
    }

    export function toHumanMessages(humanMessage?: string | string[]): HumanMessage[] {
        if (humanMessage?.length) {
            return [toHumanMessage(humanMessage)];
        }
        return [];
    }

    export function toAIMessage(aiMessage: string | string[]): AIMessage {
        return new AIMessage(Array.isArray(aiMessage) ? aiMessage.join('\n') : aiMessage);
    }

    export function toAIMessages(aiMessage?: string | string[]): HumanMessage[] {
        if (aiMessage?.length) {
            return [toHumanMessage(aiMessage)];
        }
        return [];
    }

    export function toSystemMessage(systemMessage: string | string[]): SystemMessage {
        return new SystemMessage(Array.isArray(systemMessage) ? systemMessage.join('\n') : systemMessage);
    }

    export function toSystemMessages(systemMessage?: string | string[]): SystemMessage[] {
        if (systemMessage?.length) {
            return [toSystemMessage(systemMessage)];
        }
        return [];
    }

    export async function getChatBaseSystemMessage(): Promise<SystemMessage> {
        const systemMessage = CHAT_BASE_PROMPT.join('\n').replace(new RegExp(APP_DISPLAY_NAME, 'g'), localize('displayName'));
        return toSystemMessage(systemMessage);
    }

    export async function appendChatLanguagePrompt(message: string, mainLanguage?: string): Promise<string> {
        if (mainLanguage) {
            return `${message}\n${getChatLanguagePrompt(mainLanguage)}`;
        }
        mainLanguage = await LanguageUtils.getCurrentProjectMainLanguage();
        if (mainLanguage) {
            return `${message}\n${getChatLanguagePrompt(mainLanguage)}`;
        }
        return message;
    }

    export function getSafetyRules(): string[] {
        return SAFETY_RULES.map(s => s.replace(new RegExp(APP_DISPLAY_NAME, 'g'), localize('displayName')));
    }

    export function getVSCodeSystemMessage(): string {
        return VSCODE_PROMPT.replace(new RegExp(APP_DISPLAY_NAME, 'g'), localize('displayName'));
    }

    export function getSafetyRulesSystemMessage(): SystemMessage {
        const systemMessage = SAFETY_RULES.join('\n').replace(new RegExp(APP_DISPLAY_NAME, 'g'), localize('displayName'));
        return toSystemMessage(systemMessage);
    }

    export function toChatSystemMessages(systemMessages?: string | string[]): ChatCompletionRequestMessage[] | undefined {
        if (systemMessages?.length) {
            return [
                {
                    role: ChatCompletionRequestMessageRoleEnum.System,
                    content: Array.isArray(systemMessages) ? systemMessages.join('\n') : systemMessages
                }
            ];
        }
        return;
    }

    export function parsePrefixMessages(prefixMessages?: ChatCompletionRequestMessage[]): BaseMessagePromptTemplate[] | undefined {
        if (prefixMessages?.length) {
            return prefixMessages
                .filter(m => m.content)
                .map(m => {
                    switch (m.role) {
                        case ChatCompletionRequestMessageRoleEnum.System:
                            return SystemMessagePromptTemplate.fromTemplate(m.content!);
                        case ChatCompletionRequestMessageRoleEnum.User:
                            return HumanMessagePromptTemplate.fromTemplate(m.content!);
                    }
                })
                .filter(t => !!t) as BaseMessagePromptTemplate[];
        }
    }

    export async function getBaseMessageTemplates(prefixMessages?: ChatCompletionRequestMessage[]): Promise<BaseMessagePromptTemplate[]> {
        const chatBaseSystemMessageTemplates = [SystemMessagePromptTemplate.fromTemplate((await getChatBaseSystemMessage()).content)];
        return prefixMessages ? MessageUtils.parsePrefixMessages(prefixMessages) ?? [] : chatBaseSystemMessageTemplates;
    }

    export function toMessagesByHistory(history: ChatMessage[]): BaseMessage[] {
        const messages: BaseMessage[] = [];
        for (const message of history) {
            if (!message.content) {
                continue;
            }
            if (message.role === ChatMessageRole.User) {
                messages.push(MessageUtils.toHumanMessage(message.content));
            } else if (message.role === ChatMessageRole.System) {
                messages.push(MessageUtils.toSystemMessage(message.content));
            } else if (message.role === ChatMessageRole.Assistant) {
                messages.push(MessageUtils.toAIMessage(message.content));
            }
        }
        return messages;
    }
}
