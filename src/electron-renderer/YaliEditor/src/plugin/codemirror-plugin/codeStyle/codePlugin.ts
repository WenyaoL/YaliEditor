/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import { html } from '@codemirror/lang-html';

/**
 * 数字栏设置
 */
const gutterBasicSetup: Extension = (() => [
    lineNumbers(),
    highlightActiveLineGutter(),
    foldGutter(),
])();;



export const noLineNumberBasicSetup: Extension = /*@__PURE__*/(() => [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    //highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
    ])
])();;




export const myMinimalSetup: Extension = /*@__PURE__*/(() => [
    highlightSpecialChars(),
    drawSelection(),
    crosshairCursor(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
        ...defaultKeymap,
    ])
])();

export const HTMLBlockSetup = () => [
    myMinimalSetup,
    html(),
    keymap.of([indentWithTab]),
]

export default {
    noLineNumberBasicSetup, 
    gutterBasicSetup, 
    myMinimalSetup,
    HTMLBlockSetup
}