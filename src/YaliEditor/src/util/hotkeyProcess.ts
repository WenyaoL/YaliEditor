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
 * @param ir 
 * @param payload 
 */
export function updateBlockIR(ir:IR,payload:any){

    let keyboardEvent:KeyboardEvent;
    switch(payload.type){
        case "blod":
            break;
        case "codeblock":
            keyboardEvent = new KeyboardEvent("keydown",{
                ctrlKey:true,
                shiftKey:true,
                code:"KeyK"
            })
            ir.hotkeyProcessor.codeblockKey(keyboardEvent)
            break;
        case "codeline":
            keyboardEvent = new KeyboardEvent("keydown",{
                ctrlKey:true,
                shiftKey:true,
                code:"Backquote",
                key:"~"
            })
            ir.hotkeyProcessor.codelineKey(keyboardEvent)
            break;
        case "deleteline":
            keyboardEvent = new KeyboardEvent("keydown",{
                ctrlKey:true,
                shiftKey:true,
                key:"5"
            })
            ir.hotkeyProcessor.deletelineKey(keyboardEvent)
            break;
    }
}


export function updateMulLineIR(){

}


export default {
    updateLineIR,
    updateBlockIR,
    updateMulLineIR
}