/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */

export const toImgText = (info:string,src:string)=>{
    "![" + info +"](" + src + ")"
}

export const toImgElementText = (info:string,src:string)=>{
    const pre = '<span >' + '![' + '</span>'
    const mid = '<span >' + '](' + '</span>'
    const suf = '<span >' + ')' + '</span>'
    info = '<span class="md-info">' + info +  '</span>'
    src = '<span class="md-link-url">' + src +  '</span>'

    return pre + info + mid + src + suf
}


export const toTocElementText = (headings:{
    type: string;
    content: string;
    id: string;
    level: number;
}[])=>{
    let res:string[]=[]
    

    for (let index = 0; index < headings.length; index++) {
        const element = headings[index];
        let head = '<span class="md-toc-h'+ element.level +' md-toc-item ">' + '<a to-href="'+element.id+'">'+ element.content+'</a></span>'
        res.push(head)
    }
    /*headings.forEach(heading=>{
        let level = heading.tagName.charAt(1)
        res.push('<span class="'+'md-toc-h'+level+' md-toc-item ">'
            +'<a to-href="'+ heading.id+ '">'+ heading.textContent+ 
            '</a></span>')

    })*/
    return res.join('')
}

export const toTocData = ()=>{

}


export function toKeyText(event: KeyboardEvent){
    let strs = []

    if(event.ctrlKey){
        strs.push("ctrl")
    }
    
    if(event.shiftKey){
        strs.push("shift")

    }

    if(event.altKey){
        strs.push("alt")
    }

    if(event.key){
        strs.push(event.key.toLowerCase())
    }

    return strs.join("+")
}

export function createTableStr(row:number,col:number){
    let res:string[] = []
    row = row+1

    
    for (let i = 0; i<row; i++) {
        let str = '|      '
        if(i==1) str = '| ---- '
        
        for (let j = 0; j < col; j++) {
            res.push(str)
        }
        res.push('|\n')
    }
    return res.join('')
    
    
  }