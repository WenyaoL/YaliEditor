import IR from "../ir";



/**
 * 转换成IR模式的跟新
 * line type update
 * to add text at the top of line. such as :
 * line code   ->   # line code
 * line code   ->   ## line code
 * @param ir
 * @param payload 
 */
export function updateLineIR(ir:IR,payload:any){
    if(payload.type === "head"){
        const keyboardEvent = new KeyboardEvent("keydown",{
            ctrlKey:true,
            key:""+payload.level
        })
        ir.hotkeyProcessor.headingKey(keyboardEvent)
    }
    return
}

/**
 * change to IR model
 * block type update
 * change selected code,such as:
 * abc  ->  **abc**
 *      ->  ****
 * abc  ->  '''abc'''
 * abc  ->  `abc`
 * 代码块，代码，粗体，下划线，斜体，等
 * @param ir 
 * @param payload 
 */
export function updateBlockIR(ir:IR,payload:any){

    let keyboardEvent:KeyboardEvent;
    switch(payload.type){
        case "blod":
            ir.hotkeyProcessor.blodKey(null)
            break;
        case "codeblock":
            ir.hotkeyProcessor.codeblockKey(null)
            break;
        case "codeline":
            ir.hotkeyProcessor.codelineKey(null)
            break;
        case "deleteline":
            ir.hotkeyProcessor.deletelineKey(null)
            break;
        case "underline":
            ir.hotkeyProcessor.underlineKey(null)
            break;
        case "italic":
            ir.hotkeyProcessor.italicKey(null)
            break;
    }
}

/**
 * line type update
 * to add text at the top of lines. such as :
 * line1      - line1
 * line2  ->  - line2
 * line3      - line3
 * 有序列表，无序列表
 */
export function updateMulLineIR(ir:IR,payload:any){
    if(payload.type == "unlist"){ //无序列表
        ir.hotkeyProcessor.unlistKey(null)
    }else if(payload.type == "list"){
        ir.hotkeyProcessor.listKey(null)
    }else if(payload.type == "quote"){
        ir.hotkeyProcessor.quoteKey(null)
    }
}

export function createTocIR(ir:IR){
    ir.hotkeyProcessor.tocKey(null)
}

export default {
    updateLineIR,
    updateBlockIR,
    updateMulLineIR,
    createTocIR,
}