/**
 * 修复codemirror Gutter 样式问题
 * @param {*} e 修复指定元素下的样式问题
 */
 export function fixCodemirrorGutterStyle(e){
    let gutters = null;
    if(e){
        gutters = e.getElementsByClassName("cm-gutterElement")
    }

    if(!gutters){
        gutters = document.getElementsByClassName("cm-gutterElement")
    }
    
    for (let index = 0; index < gutters.length; index++) {
        const element = gutters[index]
        if(element.style.height === "14px"){
            element.style.height = "22.4px"
        }
    }

}