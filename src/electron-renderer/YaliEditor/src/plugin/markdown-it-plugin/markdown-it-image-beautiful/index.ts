/**
 * @author liangwenyao
 * @since 2022/8/19
 */
import type MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import { toImgElementText } from "../util/formatText"
import Reg from '../../../constant/reg'
import YaLiEditor from "../../../index";
import path from "path";

const errorImgData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWwAAADsCAYAAABQWJzVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAU6SURBVHhe7d0xa2RVGIBh/38lLCwEVnZRBAUbG8HGQrCwEgs7sbASCzsRtomchSvXyU1mQibhe+EpHgJz752Z6uXwnTPko7//eX8LwHyCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCDRAh2AARgg0QIdgAEYINECHYABGCzVjf//Dji/rp519u//jzr8PvAhMINiOteH786ubFrXAffR+YQLAZaYVzi+iXX3397D5597lgM55gM9IW7BXTo+vXtj5HsJlOsBlJsOEuwWYkwYa7BJuRBBvuEmxGujTY6zTJNY7jCTYFgs1I54K9Ar2ub566EhdsCgSbkc4F++ic9lNW2YJNgWAz0rlg//rb7/+L9TpHfXTfpW7efCrYjCfYjHQu2Ms33373IdTrnhXwo3susd5nC79gM5lgM9Ilwb6G09GKYDOZYDPSSwR7P1Z5ffNWsBlPsBnpuYO9P2WyjVUEm+kEm5EeG+y1Wn7MKZEt0Mt6VrApEGxGujTY+/BuwT0X7v0m47ZZKdgUCDYjXRLs01hv1uv3RXu/ybiPs2BTINiMdC7Y+/CuFfNaKe9XzmsufRrt/Sbj6fsKNgWCzUgPBXu/YXh6fT23/TOCZYX99JmjH9kINgWCzUj3BXuFdwvyUXiXtZLeR3uL8WabW+8JNgWCzUj3BXsf36PwbvZh37vvGcGmQLAZ6SjY22uPCesaiax713z7dKa9J9gUCDYjnQb7oQ3DaxBsCgSbkfbBPrdheA2CTYFgM9I+2FtMl4fm1k8h2BQINiNtwX7z9u4Rvecg2BQINiNtwX71+s2Hv2vT8Oi+axFsCgSbkbZgr5n1u8+++G808lzWZwk20wk2I+1/ev6SnnPsAk8l2Iy0ToZsZ6hf0tF3gSkEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwASIEGyBCsAEiBBsgQrABIgQbIEKwARLe3/4LdA2SLM5klBgAAAAASUVORK5CYII=";
let editor: YaLiEditor = null;
let currFilePath = null


/**
 * 解析路径，如果为相对路径，返回相对路径以及路径映射
 * @param src 
 * @param deCode 
 * @returns 
 */
function resolvePath(src: string, deCode: boolean) {
  if (!src) return { 'src': src }

  let res = {'src': src}

  //decode
  if (deCode) res['decodeSrc'] = decodeURI(src)
  else res['decodeSrc'] = src

  //相对路径解析
  if (res['decodeSrc'] && Reg.relativeFilePathReg.test(res['decodeSrc'])) {
    editor.ir.applicationEventPublisher.publish("GET-CurrFilePath")
    if(!currFilePath) return res
    const currdir = Reg.dirPathReg.exec(currFilePath)[0]
    res['data-map'] = path.join(currdir?currdir:'', res['decodeSrc'])
  }

  return res
}

function image(tokens: Token[], idx: number, options: Object, env: Object, slf: Renderer) {
  var token = tokens[idx];

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value
  if (token.attrs && token.children) {
    token.attrs[token.attrIndex('alt')][1] =
      slf.renderInlineAsText(token.children, options, env);
  }

  token.attrPush(["onerror", "irImgerror(event)"])
  token.attrPush(["onload", "irImgload(event)"])

  let src = token.attrGet("src")||''
  let resolvedPath:any = null
  if (Reg.imgBase64Reg.test(src)) {
    resolvedPath = {
      "src": src,
      'decodeSrc': src
    }
  } else {
    try{
      resolvedPath = resolvePath(src, true)
    }catch(error){
      resolvedPath = {
        "src": src,
        'decodeSrc': src
      }
    }
    
  }

  //相对路径
  if (resolvedPath['data-map']) {
    token.attrPush(["data-map", resolvedPath['data-map']])
    token.attrSet("src", resolvedPath['data-map'])
  }

  const type = resolvedPath['src'] && resolvedPath['decodeSrc'] ? "md-hiden" : "md-like"
  const img = slf.renderToken(tokens, idx, options);
  let imgInfo = toImgElementText(token.content, resolvedPath['decodeSrc'])

  return `<span class="md-image" md-inline="img"><span class="${type}">${imgInfo}</span>${img}</span>`
};

function plugin(md: MarkdownIt, options: any) {
  editor = options.editor;
  editor.ir.applicationEventPublisher.subscribe("RETURN-CurrFilePath", (filePath) => {
    currFilePath = filePath
  })
  md.renderer.rules.image = image;

  (document as any).irImgerror = (event: Event) => {
    const img = event.target as HTMLImageElement

    let url = img.previousElementSibling.querySelector(".md-img-url.md-meta").textContent
    const resolvedPath = resolvePath(url, false)

    if (!img.hasAttribute("loading") && resolvedPath['data-map']) {
      img.src = resolvedPath['data-map']
      img.setAttribute("loading", "1")
      img.classList.remove("errorimg")
      return
    } else {
      img.classList.add("errorimg")
      img.removeAttribute("loading")
      img.src = errorImgData
      img.previousElementSibling!.className = "md-like"
    }
    //img.onerror = null; //防止闪图
  }

  (document as any).irImgload = (event: Event) => {
    const img = event.target as HTMLImageElement
    if(img.src!=errorImgData)img.classList.remove("errorimg")
  }
}

export default plugin