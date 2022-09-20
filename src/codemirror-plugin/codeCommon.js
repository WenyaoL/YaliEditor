import {toTypeStr} from './common'
import {Text} from "@codemirror/state"
/**
 * block type update
 * change selected code,such as:
 * abc  ->  **abc**
 *      ->  ****
 * abc  ->  '''abc'''
 * abc  ->  `abc`
 * @param {*} editView 
 * @param {*} payload
 */
export function updateBlock(editView,payload){
    const state = editView.state
    
    if(state.selection.main.empty){
        const newStr = toTypeStr('',payload)
        editView.dispatch(state.replaceSelection(newStr))
    }else{
        const from = state.selection.main.from
        const to = state.selection.main.to
        const oldStr = state.sliceDoc(from,to)
        const newStr = toTypeStr(oldStr,payload)
        editView.dispatch(state.replaceSelection(newStr))
    }
}
/**
 * line type update
 * to add text at the top of line. such as :
 * line code   ->   # line code
 * line code   ->   ## line code
 * 
 * @param {*} editView 
 * @param {*} payload 
 */
export function updateLine(editView,payload){
    const state = editView.state
    const from = state.selection.main.from
    const linefrom = state.doc.lineAt(from).from
    const newStr = toTypeStr('',payload);
    editView.dispatch({changes:{from:linefrom,insert:newStr}})
}


/**
 * line type update
 * to add text at the top of lines. such as :
 * line1      - line1
 * line2  ->  - line2
 * line3      - line3
 * @param {*} editView 
 * @param {*} payload 
 */
export function updateMulLine(editView,payload){
    if(payload.type == "list"){
        updateOrderedLine(editView)
        return
    }
    const state = editView.state
    const from = state.selection.main.from
    const to = state.selection.main.to
    const lineStart = state.doc.lineAt(from).number
    const lineEnd = state.doc.lineAt(to).number
    const lineFrom = state.doc.lineAt(from).from
    const lineTo = state.doc.lineAt(to).to
    const addStr = toTypeStr('',payload);
    let arr = [];
    for(let i = lineStart;i<=lineEnd;i++){
        const line = state.doc.line(i)
        arr.push(addStr+line.text)
    }
    //let text = state.doc.replace(from,to,Text.of(arr))
    editView.dispatch({changes:{from:lineFrom,to:lineTo,insert:Text.of(arr)}})
}


/**
 * 
 * @param {*} editView 
 * @param {*} payload 
 */
export function updateOrderedLine(editView){
    const state = editView.state
    const from = state.selection.main.from
    const to = state.selection.main.to
    const lineStart = state.doc.lineAt(from).number
    const lineEnd = state.doc.lineAt(to).number
    const lineFrom = state.doc.lineAt(from).from
    const lineTo = state.doc.lineAt(to).to
    let arr = [];
    let n = 1;
    for(let i = lineStart;i<=lineEnd;i++){
        const line = state.doc.line(i)
        arr.push(n+'. '+line.text)
        n++;
    }
    editView.dispatch({changes:{from:lineFrom,to:lineTo,insert:Text.of(arr)}})
}

export function createToc(editView,payload){
    const state = editView.state
    const from = state.selection.main.from
    const to = state.selection.main.to
    editView.dispatch({changes:{from:from,to:to,insert:"[toc]"}})
}


export default {updateLine,updateBlock,updateMulLine,updateOrderedLine,createToc}