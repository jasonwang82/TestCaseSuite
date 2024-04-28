import llamaTokenizer from 'llama-tokenizer-js';

export namespace TokenizerUtils {
    function tokenize(text: string | undefined) {
        if (!text) {
            return [];
        }
        return llamaTokenizer.encode(text);
    }

    export function getTokenLength(text?: string): number {
        return tokenize(text).length;
    }
}
