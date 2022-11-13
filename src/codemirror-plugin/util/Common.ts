/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {EditorState,type Extension, Compartment,StateEffect} from "@codemirror/state"
import {EditorView, keymap,ViewUpdate} from "@codemirror/view"
import {Text} from "@codemirror/state"

/**
 * 创建一个compartment,并和对其修改的run函数
 * @param view 
 * @returns 
 */
 // https://codemirror.net/examples/config/
 // https://github.com/uiwjs/react-codemirror/blob/22cc81971a/src/useCodeMirror.ts#L144
 // https://gist.github.com/s-cork/e7104bace090702f6acbc3004228f2cb
 export const createEditorCompartment = () => {
    const compartment = new Compartment()
    const run = (extension: Extension,view: EditorView) => {
        if(compartment.get(view.state)){   
            view.dispatch({ effects: compartment.reconfigure(extension) }) // reconfigure
        }else{
            view.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(extension)) })// inject
        }
    }
    return { compartment, run }
}
 
/**
* 创建可以切换开关的Compartment，通过返回的函数来控制开关，如
* let switch = createEditorExtensionToggler(view,extension )
* switch(true) //开
* switch(false) //关
* @param view 
* @param extension 
* @returns 
*/
// https://codemirror.net/examples/reconfigure/
export const createEditorExtensionToggler = (view: EditorView, extension: Extension) => {
    const { compartment, run } = createEditorCompartment()
    return (targetApply?: boolean) => {
    const exExtension = compartment.get(view.state)
    const apply = targetApply ?? exExtension !== extension
    run(apply ? extension : [],view)
    }
}


/**
 * 格式化codemirror的字符串
 * @param {*} oldStr 
 * @param {*} payload 
 * @returns 
 */
 export function toTypeStr(oldStr,payload){
    let newStr = '';
    console.log(payload)
    switch(payload.type){
        case "head":
            let s = new String("#######")
            newStr = s.substring(0,payload.level) +" "+oldStr
            break;
        case "blod":
            console.log("创建粗体字")
            newStr = "**"+oldStr+"**"
            break;
        case "underline":
            newStr = "<u>"+oldStr+"</u>" 
            break;
        case "codeblock":
            console.log("创建代码块")
            newStr = "\n```\n"+oldStr+"\n```\n" 
            break;
        case "mathblock":
            console.log("创建公式块")
            newStr = "\n$$\n"+oldStr+"\n$$\n" 
            break;
        case "unlist":
            console.log("创建list块")
            newStr = "- "+oldStr
            break;
        case "quote":
            console.log("创建list块")
            newStr = "> "+oldStr
            break;
        case "codeline":
            newStr = "`"+oldStr+"`"
            break;
        case "deleteline":
            newStr = "~~"+oldStr+"~~"
            break;
        case "italic":      
            newStr = "*"+oldStr+"*"
            break;
        default:
            newStr=oldStr
    }
    return newStr
}


/**
 * 修复codemirror Gutter 样式问题
 * @param {*} e 修复指定元素下的样式问题
 */
 export function fixCodemirrorGutterStyle(e:HTMLElement){
    let gutters:any = null;
    if(e){
        gutters = e.getElementsByClassName("cm-gutterElement")
    }

    if(!gutters){
        gutters = document.getElementsByClassName("cm-gutterElement")
    }
    
    for (let index = 0; index < gutters.length; index++) {
        const element = gutters[index]
        if(element.style.height === "14px"){
            element.style.height = "22.4px"
        }
    }

}


/**
 * codemirror Completions plugin
 * @param {*} context 
 * @returns 
 */
export function codeCompletions(context:any) {
    let word = context.matchBefore(/./)
    if (word.from == word.to && !context.explicit)
        return null
    return {
        from: word.from,
        options: [
        {label: "h1", type: "text", apply: "# ", detail: "#"},
        {label: "h2", type: "text", apply: "## ", detail: "##"},
        {label: "h3", type: "text", apply: "### ", detail: "###"},
        {label: "h4", type: "text", apply: "#### ", detail: "####"},
        {label: "h5", type: "text", apply: "##### ", detail: "#####"},
        {label: "u", type: "text", apply: "<u></u>", detail: "<u></u>"},
        {label: "b", type: "text", apply: "****", detail: "****"},
        {label: "`java", type: "text", apply: "```java\n\n```", detail: "java code"},
        {label: "`js", type: "text", apply: "```javascript\n\n```", detail: "javascript code"},
        {label: "`python", type: "text", apply: "```python\n\n```", detail: "python code"},
        {label: "`html", type: "text", apply: "```html\n\n```", detail: "html code"},
        ]
    }
}


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
    let arr:string[] = [];
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
    let arr:string[] = [];
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