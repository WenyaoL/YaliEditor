/**
 * @author liangwenyao
 * @since 2023/1/8
 * @github https://github.com/WenyaoL/YaliEditor
 */

export const httpReg = new RegExp("^http://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$")
export const httpsReg = new RegExp("^https://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$")
export const urlReg = new RegExp("^(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$")

export const emptyString = /^[\s]*$/;

export const markdownRuleStr = /[+*-~`#>\[\]]/

export const numberReg = /[0-9]/

export const linuxAbsFilePathReg = /^\/([\w \u4e00-\u9fa5]+\/)*([\w \u4e00-\u9fa5]+\.\w+)*$/
export const windowAbsFilePathReg = /^[a-zA-Z]:(\\[\\]*)*([\w \u4e00-\u9fa5]*[\\]?)*[.\w]*/
export const relativeFilePathReg = /^(\.{1,2}[\/\\])*([\w \u4e00-\u9fa5]+[\/\\])*([\w \u4e00-\u9fa5]+\.\w+)*$/
export const dirPathReg = /.*(?=[\/\\][\w \u4e00-\u9fa5]*\.[\w]+$)/


export const alphabetReg = /[a-zA-Z]/;

export const htmlTitleReg = /(?<=<title.*>)(.*)(?=<\/title>)/;
export const htmlcommentReg = /^<!--[\s\S]*/
export const imgBase64Reg = /^data:image\/.*;base64/

export const imgReg = /\.(bmp|jpeg|jpg|gif|png|svg)$/

export const markdownReg = /\.(md|txt|markdown|mkd|mdown|mkdn)$/


export default {
    httpReg,
    httpsReg,
    urlReg,
    emptyString,
    markdownRuleStr,
    numberReg,
    linuxAbsFilePathReg,
    windowAbsFilePathReg,
    relativeFilePathReg,
    dirPathReg,
    alphabetReg,
    htmlTitleReg,
    htmlcommentReg,
    imgBase64Reg,
    imgReg,
    markdownReg
}