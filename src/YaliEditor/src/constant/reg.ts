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

export const alphabetReg = /[a-zA-Z]/;

export const htmlTitleReg = /(?<=<title>)(.*)(?=<\/title>)/;

export default {
    httpReg,
    httpsReg,
    urlReg,
    emptyString,
    markdownRuleStr,
    numberReg,
    alphabetReg,
    htmlTitleReg
}