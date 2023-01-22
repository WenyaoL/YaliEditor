/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { YaLiEditorOptions } from '../types';
import {_YALI_VERSION} from './constant/constants'
import IR from './ir';
import {EditorConfig} from './options'
import MarkdownTool from './tool/MarkdownTool'
import DomTool from './tool/DomTool'
import './ir/index.scss'
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.min'

import _ from 'lodash'
class YaLiEditor {
    public readonly version: string;
    public options : EditorConfig;
    public rootElement : HTMLElement;
    public ir : IR;
    public markdownTool:MarkdownTool;
    public domTool:DomTool

    constructor(id: string | HTMLElement, options?: EditorConfig){
        this.version = _YALI_VERSION;

        if (typeof id === "string") {
            id = document.getElementById(id);
        }
        
        
        if(options)this.options = options
        else this.options = EditorConfig.defalut()


        
        
        this.init(id,this.options)
    }

    private init(id: HTMLElement, options: EditorConfig){
        this.rootElement = id;
        const div = document.createElement("div")
        div.id = "yali-tool-tip"
        this.rootElement.appendChild(div)
        this.ir = new IR(this);
        this.markdownTool = new MarkdownTool(this)
        this.domTool = new DomTool(this)
        this.ir.init()
    }

    public render(src:string){    
        this.ir.load(src)
    }

    /**
     * 将编辑器重新挂载到另一个容器中(历史记录等信息将会缓存)
     * @param id 
     */
    public reMount(id: string | HTMLElement){
        if (typeof id === "string") {
            id = document.getElementById(id);
        }
        //更新设置挂载容器
        this.rootElement = id;

        //IR面板重新挂载
        this.ir.reMount()
    }

    public getMarkdownText(){
        return this.ir.getMarkdown()
    }

    public focus(){
        this.ir.focus()
    }
    
}

export default YaLiEditor;