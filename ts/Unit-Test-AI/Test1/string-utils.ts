import { CommonUtils } from './common-utils';
import * as ObjectUtils from './object-utils';

export namespace StringUtils {
    export function calculateSimilarityScore(first: string, second: string): number {
        first = first.replace(/\s+/g, '');
        second = second.replace(/\s+/g, '');

        if (first === second) {
            return 1; // identical or empty
        }
        if (first.length < 2 || second.length < 2) {
            return 0; // if either is a 0-letter or 1-letter string
        }

        const firstBigrams = new Map<string, number>();
        for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2);
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram)! + 1 : 1;
            firstBigrams.set(bigram, count);
        }

        let intersectionSize = 0;
        for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2);
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram)! : 0;

            if (count > 0) {
                firstBigrams.set(bigram, count - 1);
                intersectionSize++;
            }
        }

        return (2.0 * intersectionSize) / (first.length + second.length - 2);
    }

    export function addComment(text: string, languageId: string): string {
        const markers = CommonUtils.getLanguageCommentMarkers(languageId);
        if (markers) {
            const end = markers.end === '' ? '' : ' ' + markers.end;
            return `${markers.start} ${text}${end}`;
        }
        return '';
    }

    export function addBlockComments(text: string, languageId: string): string {
        const markers = CommonUtils.getLanguageCommentMarkers(languageId);
        if (!markers || text === '') {
            return '';
        }
        const lines = text.split('\n');
        return lines.map(line => addComment(line, languageId)).join('\n');
    }

    export function appendNewLine(str: string): string {
        return str === '' || str.endsWith('\n') ? str : str + '\n';
    }

    export function trimLastLine(source: string): string {
        const lines = source.split('\n');
        const lastLine = lines[lines.length - 1];
        const extraSpace: number = lastLine.length - lastLine.trimEnd().length;
        return source.slice(0, source.length - extraSpace);
    }

    export function testNumber(source: number): string {
        if(source<10){
            return 'mini';
        }else if(source<100){
            return 'small';
        }else if(source<1000){
            return 'nomal';
        }else if(source<10000){
            return 'big';
        }else{
            return 'large'
        }
    }
}
