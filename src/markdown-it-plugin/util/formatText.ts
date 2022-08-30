

export const toImgText = (info:string,src:string)=>{
    "![" + info +"](" + src + ")"
}

export const toImgElementText = (info:string,src:string)=>{
    const pre = '<span class="md-hiden" >' + '![' + '</span>'
    const mid = '<span class="md-hiden" >' + '](' + '</span>'
    const suf = '<span class="md-hiden" >' + ')' + '</span>'
    info = '<span class="md-info md-hiden md-meta">' + info +  '</span>'
    src = '<span class="md-img-url md-hiden md-meta">' + src +  '</span>'
    
    
    
    return pre + info + mid + src + suf
}

export function toKeyText(event: KeyboardEvent){
    let res = ""
    if(event.ctrlKey){
        res += "ctrl"
    }
    
    if(event.shiftKey){
        res +="+"
        res += "shift"
    }

    if(event.altKey){
        res +="+"
        res += "alt"
    }

    if(event.key){
        res +="+"
        res += event.key
    }

    return res
}