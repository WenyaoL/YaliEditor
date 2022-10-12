import { EditorView } from '@codemirror/view';
const oneLight = EditorView.theme({
    '&.cm-editor.cm-focused': {
        outline: "none"   //移除外边框线
    },
    '&':{
        font: "16px Arial, monospace ",  //字体
    },
    '.cm-scroller':{
        "border-radius": "3px",
        //"background-color":"#f6f6f6"
    }
})

export { oneLight};