import { YaLiEditorOptions } from '../types';
import {_YALI_VERSION} from './constants'
import IR from './ir';
import {EditorOptions} from './options'

import './ir/index.css'
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'


class YaLiEditor {
    public readonly version: string;
    public options : EditorOptions;
    public rootElement : HTMLElement;
    public ir : IR;
    

    constructor(id: string | HTMLElement, options?: YaLiEditorOptions){
        this.version = _YALI_VERSION;

        if (typeof id === "string") {
            id = document.getElementById(id);
        }
        this.options = new EditorOptions(options)
        
        this.init(id,this.options)
    }

    private init(id: HTMLElement, options: EditorOptions){
        this.rootElement = id;
        this.ir = new IR(this);

    }

    public render(src:string){    
        this.ir.load(src)
    }

    public getMarkdownText(){
        return this.ir.getMarkdown()
    }
}

export default YaLiEditor;