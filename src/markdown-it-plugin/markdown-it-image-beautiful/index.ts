/**
 * @author liangwenyao
 * @since 2022/8/19
 */
import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import {toImgElementText} from "../util/formatText"
import Reg from '../../YaliEditor/src/constant/reg'


const errorImgData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWwAAADsCAYAAABQWJzVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAU6SURBVHhe7d0xa2RVGIBh/38lLCwEVnZRBAUbG8HGQrCwEgs7sbASCzsRtomchSvXyU1mQibhe+EpHgJz752Z6uXwnTPko7//eX8LwHyCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCzVjf//Dji/rp519u//jzr8PvAhMINiOteH786ubFrXAffR+YQLAZaYVzi+iXX3397D5597lgM55gM9IW7BXTo+vXtj5HsJlOsBlJsOEuwWYkwYa7BJuRBBvuEmxGujTY6zTJNY7jCTYFgs1I54K9Ar2ub566EhdsCgSbkc4F++ic9lNW2YJNgWAz0rlg//rb7/+L9TpHfXTfpW7efCrYjCfYjHQu2Ms33373IdTrnhXwo3susd5nC79gM5lgM9Ilwb6G09GKYDOZYDPSSwR7P1Z5ffNWsBlPsBnpuYO9P2WyjVUEm+kEm5EeG+y1Wn7MKZEt0Mt6VrApEGxGujTY+/BuwT0X7v0m47ZZKdgUCDYjXRLs01hv1uv3RXu/ybiPs2BTINiMdC7Y+/CuFfNaKe9XzmsufRrt/Sbj6fsKNgWCzUgPBXu/YXh6fT23/TOCZYX99JmjH9kINgWCzUj3BXuFdwvyUXiXtZLeR3uL8WabW+8JNgWCzUj3BXsf36PwbvZh37vvGcGmQLAZ6SjY22uPCesaiax713z7dKa9J9gUCDYjnQb7oQ3DaxBsCgSbkfbBPrdheA2CTYFgM9I+2FtMl4fm1k8h2BQINiNtwX7z9u4Rvecg2BQINiNtwX71+s2Hv2vT8Oi+axFsCgSbkbZgr5n1u8+++G808lzWZwk20wk2I+1/ev6SnnPsAk8l2Iy0ToZsZ6hf0tF3gSkEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwARLe3/4LdA2SLM5klBgAAAAASUVORK5CYII=";

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
    const src = token.attrGet("src")
    let decodeSrc:string = ""
    if(src){
      if(Reg.imgBase64Reg.test(src)) decodeSrc = src
      else{
        let decurl = decodeURI(src)
        decodeSrc=decurl
        //decodeSrc = Reg.urlReg.test(src) || Reg.windowFilePathReg.test(src) || Reg.linuxFilePathReg.test(src)?decurl:errorImgData
      }
    } 
    
    const type = src&&decodeSrc?"md-hiden":"md-like"


    token.attrPush(["onerror","ir_imgerror(event)"])

    const img = slf.renderToken(tokens, idx, options);

    const root = document.createElement("span")
    root.classList.add("md-image")

    root.setAttribute("md-inline","img")

    const span = document.createElement("span")
    span.classList.add(type)

    
    
    let text = toImgElementText(token.content,decodeSrc)
    span.innerHTML = text
    root.appendChild(span)
    //将字符串解析为element,并插入到第一个孩子前面
    root.insertAdjacentHTML("beforeend",img)
    return root.outerHTML
  };

function plugin(md: MarkdownIt, options: any) {
    md.renderer.rules.image = image;
    //md.block.ruler.disable("html_block")
    (document as any).ir_imgerror = (event:Event)=>{
      let img = event.target as HTMLImageElement
      img.style.width = "300px"
      img.src = errorImgData
      img.previousElementSibling.className = "md-like"
      //img.onerror = null; //防止闪图
    }
}

export default plugin