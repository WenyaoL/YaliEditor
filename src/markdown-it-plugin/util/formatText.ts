

export const toImgText = (info:string,src:string)=>{
    "![" + info +"](" + src + ")"
}

export const toImgElementText = (info:string,src:string)=>{
    const pre = `<span>![</span>`
    const mid = `<span>](</span>`
    const suf = `<span>)</span>`
    info = '<span class="md-info md-meta">' + info +  '</span>'
    src = '<span class="md-img-url md-meta">' + src +  '</span>'
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