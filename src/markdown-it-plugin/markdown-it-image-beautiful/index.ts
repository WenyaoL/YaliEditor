import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import {toImgElementText} from "../util/formatText"


function htmlBlock (tokens:Token[], idx:number /*, options, env */) {
  const token =  tokens[idx];
  //适配图片
  if(token.content.startsWith("<img")){
    const p = document.createElement("p")
    p.setAttribute("md-inline","paragraph")

    const root = document.createElement("span")
    root.classList.add("md-image")

    root.setAttribute("md-inline","img")

    const span = document.createElement("span")
    span.classList.add("md-hiden")


    root.appendChild(span)
    //将字符串解析为element,并插入到第一个孩子前面
    root.insertAdjacentHTML("beforeend",token.content)
    const src = root.children[1].getAttribute("src")
    
    span.innerHTML = toImgElementText(src,src)

    p.appendChild(root)
    return p.outerHTML
  }
  return tokens[idx].content;
};

function htmlInline (tokens:Token[],idx:number /*, options, env */) {
  const token =  tokens[idx];
  //适配图片
  if(token.content.startsWith("<img")){


    
  }
  
  return tokens[idx].content;
};



function image(tokens:Token[], idx:number, options:Object, env:Object, slf: Renderer) {
    var token = tokens[idx];
  
    // "alt" attr MUST be set, even if empty. Because it's mandatory and
    // should be placed on proper position for tests.
    //
    // Replace content with actual value
    if(token.attrs && token.children){
      token.attrs[token.attrIndex('alt')][1] =
        slf.renderInlineAsText(token.children, options, env);
    }

    
    const img = slf.renderToken(tokens, idx, options);
    
    const root = document.createElement("span")
    root.classList.add("md-image")

    root.setAttribute("md-inline","img")

    const span = document.createElement("span")
    span.classList.add("md-hiden")

    const src = token.attrGet("src")
    let decodeSrc:string = ""
    if(src){
      decodeSrc = decodeURI(src)
    }
    
    let text = toImgElementText(token.content,decodeSrc)
    span.innerHTML = text
    root.appendChild(span)
    //将字符串解析为element,并插入到第一个孩子前面
    root.insertAdjacentHTML("beforeend",img)

    
    return root.outerHTML
  };

function plugin(md: MarkdownIt, options: any) {
    md.renderer.rules.image = image
    md.renderer.rules.html_block = htmlBlock
    document["markdown_it_image_beautiful_func"] = function(){
      console.log("测试");
      
    }
    
    //md.block.ruler.disable("html_block")
}

export default plugin