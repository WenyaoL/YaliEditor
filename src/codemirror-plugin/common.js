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
        default:
            newStr=oldStr
    }
    return newStr
}







export default {toTypeStr};