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

export const linuxFilePathReg = /^\/(\w+\/)+\w+\.\w+$/
export const windowFilePathReg = /^[a-zA-Z]:\\(?:\w+\\)*\w+\.\w+$/

export const alphabetReg = /[a-zA-Z]/;

export const htmlTitleReg = /(?<=<title>)(.*)(?=<\/title>)/;
export const htmlcommentReg = /^<!-[\s\S]*?-->\n?$/
export const imgBase64Reg = /^data:image\/.*;base64/

export default {
    httpReg,
    httpsReg,
    urlReg,
    emptyString,
    markdownRuleStr,
    numberReg,
    linuxFilePathReg,
    windowFilePathReg,
    alphabetReg,
    htmlTitleReg,
    htmlcommentReg,
    imgBase64Reg
}