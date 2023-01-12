/**
 * @author liangwenyao
 * @since 2023/1/8
 * @github https://github.com/WenyaoL/YaliEditor
 */

export const httpReg = new RegExp("^http://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$")
export const httpsReg = new RegExp("^https://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$")
export const urlReg = new RegExp("^(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$")

export const emptyString = /^[\s]*$/


export default {
    httpReg,
    httpsReg,
    urlReg,
    emptyString
}