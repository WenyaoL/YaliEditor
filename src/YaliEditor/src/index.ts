/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { YaLiEditorOptions } from '../types';
import {_YALI_VERSION} from './constants'
import IR from './ir';
import {EditorOptions} from './options'

import './ir/index.scss'
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'


class YaLiEditor {
    public readonly version: string;
    public options : EditorOptions;
    public rootElement : HTMLElement;
    public ir : IR;
    

    constructor(id: string | HTMLElement, options?: EditorOptions){
        this.version = _YALI_VERSION;

        if (typeof id === "string") {
            id = document.getElementById(id);
        }
        //默认选项
        let defalutOptions = EditorOptions.defalut()
        //合并
        this.options = defalutOptions.merge(options)
        
        
        this.init(id,this.options)
    }

    private init(id: HTMLElement, options: EditorOptions){
        this.rootElement = id;
        const div = document.createElement("div")
        div.id = "yali-tool-tip"
        this.rootElement.appendChild(div)
        this.ir = new IR(this);
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