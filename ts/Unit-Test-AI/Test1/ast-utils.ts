import { Position, TextDocument, Range } from 'vscode';
import { Point, SyntaxNode } from 'web-tree-sitter';
import { DocumentUtils } from './document-utils';

export namespace ASTUtils {

    export function getNode(rootNode: SyntaxNode, document: TextDocument, position: Position): SyntaxNode {
        const offset = document.offsetAt(position);
        return rootNode.namedDescendantForIndex(offset - 1);
    }

    export function getIdentifier(node: SyntaxNode): string {
        return node.namedChildren.find(c => c.type === 'identifier')?.text ?? '';
    }

    export function isProgram(node: SyntaxNode, languageId: string): boolean {
        switch (languageId) {
            case 'c':
            case 'cpp':
                return node.type === 'translation_unit';
            case 'python':
                return node.type === 'module';
            case 'java':
            case 'typescript':
            case 'javascript':
                return node.type === 'program';
            case 'go':
                return node.type === 'source_file';
        }
        return false;
    }

    export function isClass(node: SyntaxNode, languageId: string): boolean {
        switch (languageId) {
            case 'c':
            case 'cpp':
                return node.type === 'class_specifier';
            case 'python':
                return node.type === 'class_definition';
            case 'java':
            case 'typescript':
            case 'javascript':
                return node.type === 'class_body';
        }
        return false;
    }

    export function isDeclaration(node: SyntaxNode, languageId: string): boolean {
        return ['definition', 'declaration'].some(suffix => node.type.endsWith(suffix));
    }

    export function isBlock(node: SyntaxNode, languageId: string): boolean {
        if (isClass(node, languageId) || isProgram(node, languageId)) {
            return true;
        }
        if (['block', 'body', 'program'].includes(node.type)) {
            return true;
        }
        return ['_block', '_body'].some(suffix => node.type.endsWith(suffix));
    }

    export function toPosition(point: Point): Position {
        return new Position(point.row, point.column);
    }

    export function getCommentTextBeforePosition(node: SyntaxNode, document: TextDocument, position: Position): string | undefined {
        let commentStartNode: SyntaxNode | undefined;
        for (const child of node.children) {
            const endPosition = child.endPosition;
            if (endPosition.row < position.line) {
                if (isComment(child)) {
                    if (!commentStartNode) {
                        commentStartNode = child;
                    }
                } else {
                    commentStartNode = undefined;
                }
            } else {
                break;
            }
        }
        if (commentStartNode) {
            const startPosition = toPosition(commentStartNode.startPosition);
            const currentLineTextBeforePosition = DocumentUtils.getCurrentLineTextBeforePosition(document, startPosition);
            return currentLineTextBeforePosition + document.getText(new Range(startPosition, position));
        }
    }

    export function isComment(node: SyntaxNode): boolean {
        return node.type === 'comment' || node.type.endsWith('_comment');
    }

    export function hasNamedChildAfterPosition(node: SyntaxNode, position: Position): boolean {
        const startPosition = node.lastNamedChild?.startPosition;
        if (startPosition) {
            return startPosition.row > position.line;
        }
        return false;
    }

    export function getRightBracketMissingNode(node: SyntaxNode): SyntaxNode[] {
        const missingNode: SyntaxNode[] = [];
        if (node.childCount > 0) {
            const missingChildrenNode = node.children.map(childrenNode => ASTUtils.getRightBracketMissingNode(childrenNode)).flat();
            missingNode.push(...missingChildrenNode);
        }
        if (node.isMissing() && node.type === '}') {
            missingNode.push(node);
        }
        return missingNode;
    }
}
