/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { Extension } from '@codemirror/state';
import {myHistory,myHistoryKeymap} from '@/codemirror-plugin/codePlugin/history'


/**
 * 数字栏设置
 */
const gutterBasicSetup:Extension = (()=>[
    lineNumbers(),
    highlightActiveLineGutter(),
    foldGutter(),
])();;



const noLineNumberBasicSetup: Extension = /*@__PURE__*/(() => [
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


const myHistorySetup:(editor: any,uuid:string) => Extension = /*@__PURE__*/((editor,uuid) => [
    myHistory({
        editor:editor,
        uuid:uuid
    }),
    keymap.of([
        ...myHistoryKeymap,
    ])
]);

const myMinimalSetup:Extension = /*@__PURE__*/(() => [
    highlightSpecialChars(),

    drawSelection(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
        ...defaultKeymap,
    ])
])();


export{
    noLineNumberBasicSetup,gutterBasicSetup,myMinimalSetup,myHistorySetup
}