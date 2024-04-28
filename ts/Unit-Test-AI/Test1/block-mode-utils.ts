import { ContainerUtil } from '@malagu/core';
import { GrammarService } from '@coding-copilot/grammar';
/**
 * 块模式，终止符来源
 */
export enum BlockMode {
    /** treesitter 解析 */
    Parsing = 'Parsing',
    /** 服务端解析 */
    Server = 'Server',
    ParsingAndServer = 'ParsingAndServer'
}

const SUPPORTED_PARSING_LANGUAGES = ['ruby'];

export namespace BlockModeUtils {
    export async function forLanguage(languageId?: string): Promise<BlockMode> {
        if (!languageId) {
            return BlockMode.Server;
        }

        if (SUPPORTED_PARSING_LANGUAGES.includes(languageId)) {
            return BlockMode.Parsing;
        }

        const grammarService = ContainerUtil.get<GrammarService>(GrammarService);
        if (await grammarService.support(languageId)) {
            return BlockMode.ParsingAndServer;
        }

        return BlockMode.Server;
    }
}
