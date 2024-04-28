import { v4 } from 'uuid';

export const EXTENSION_NAME = 'codingcopilot';
export const CONFIGURATION_SECTION = EXTENSION_NAME;
export const CONFIGURATION_AI_SECTION = `${CONFIGURATION_SECTION}.ai`;
export const COMMAND_ID_PREFIX = `tencentcloud.${EXTENSION_NAME}.`;
export const DEFAULT_PROMPT_CRAFTER = 'default';
export const PROMPT_PLACEHOLDER = 'prompt-440cbaa7412c4d6dab5c7617c703dcb6';

// 历史遗留
export const CODE_ASSIST_X_CHAT_ENABLED = 'codeAssistXChatEnabled';
export const CODE_ASSIST_X_ENABLED = 'codeAssistXEnabled';
export const CODE_ASSIST_X_COMPLETION_MODEL = 'codeAssistXCompletionModel';
export const URI_CLOUD_STUDIO = process.env.URI_CLOUD_STUDIO || 'https://ide.cloud.tencent.com';
export const URI_AI_APPLY = 'https://cloud.tencent.com/apply/p/jkw28u1m04';

// 内部
export const CODING_COPILOT_IS_INTERNAL = 'codingCopilotIsInternal';
export const CODING_COPILOT_IS_LOGIN = 'codingCopilotIsLogin';
export const CODING_COPILOT_INLINE_CHAT_ENABLED = 'codingCopilotInlineChatEnabled';
export const CODING_COPILOT_PROPOSED_API_ENABLED = 'codingCopilotProposedApiEnabled';
export const CODING_COPILOT_CHAT_DISABLED = 'codingCopilotChatDisabled';
export const CODING_COPILOT_CHAT_SUPPORT = 'codingCopilotChatSupport';
export const CODING_COPILOT_EXTENSION_KIND = 'codingCopilotExtensionKind';
export const CODING_COPILOT_ENABLED = 'codingCopilotEnabled';
export const CODING_COPILOT_CODE_COMPLETION_SUPPORTED = 'codingCopilotCodeCompletionSupported';
export const CODING_COPILOT_USE_NEW_CHAT_API = 'codingCopilotUseNewChatApi';
export const CODING_COPILOT_NEW_INTERACTIVE_EDITOR_SESSION = 'codingCopilotNewInteractiveEditorSession';
export const CODING_COPILOT_CHAT_VARIABLE_ENABLED = 'codingCopilotChatVariableEnabled';
export const APP_DISPLAY_NAME = v4();
export const CONFIGURATION_AI_MODEL_SECTION = `${CONFIGURATION_AI_SECTION}.model`;
export const CONFIGURATION_AI_MODEL_KEY = 'model';
export const CONFIGURATION_AI_INLINE_COMPLETION_MODEL_SECTION = `${CONFIGURATION_AI_SECTION}.inlineCompletionModel`;
export const CONFIGURATION_AI_INLINE_COMPLETION_MODEL_KEY = 'inlineCompletionModel';

// 不用语言触发代码补全的边界正则
export const LANGUAGE_TRIGGER_BOUNDARY_REG_EXP = {
    python: /(:|\s|\.|\(|\[|!)$/, // python 语言只在以冒号、空格、点、小括号、中括号、感叹号结尾的情况下，才会触发补全
    go: /(\s|\.|\(|\[|{|!)$/,
    javascript: /(\s|\.|\(|\[|{|!)$/,
    typescript: /(\s|\.|\(|\[|{|!)$/,
    common: /(\s|\.)$/
};

// 代码补全 LanguageId
export const CODE_COMPLETION_LANGUAGE_ID = [
    'c',
    'cpp',
    'css',
    'go',
    'html',
    'java',
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
    'python',
    'sql',
    'markdown',
    'ruby',
    'rust',
    'json',
    'csharp',
    'kotlin',
    'shellscript',
    'bat',
    'yaml'
];

// configuration
export const CONFIGURATION_ENABLE_AUTO_COMPLETIONS = 'enableAutoCompletions';
export const CONFIGURATION_AUTO_COMPLETE_LANGUAGE = 'autoCompleteLanguage';
export const enum ConfigurationGenerationPreference {
    IntelligentMode = 'intelligentMode',
    OneLineMode = 'oneLineMode'
}
export const enum ConfigurationWelcomeMessage {
    First = 'first',
    Always = 'always',
    Never = 'never'
}
export const enum ConfigurationChatHistory {
    OpenRecent = 'openRecent',
    AlwaysNew = 'alwaysNew'
}
export const CONFIGURATION_WELCOME_MESSAGE_STORE_KEY = 'CONFIGURATION_WELCOME_MESSAGE';
