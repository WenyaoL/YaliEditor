import {diff_match_patch,patch_obj} from 'diff-match-patch';
import YaLiEditor from '..';

/**
 * IR模式下的undo处理器
 */
class IRUndo{
    //差异识别工具
    dmp:diff_match_patch;

    //undo and redo stack size
    stackSize = 50;

    hasUndo:boolean;
    //记录最后一次文本
    lastText: string;

    redoStack: patch_obj[][];
    undoStack: patch_obj[][];

    editor:YaLiEditor;
    constructor(editor:YaLiEditor,origin:string){
        this.editor = editor

        this.hasUndo = false;
        this.lastText = origin;
        this.redoStack = [];
        this.undoStack = [];

        this.dmp = new diff_match_patch();
    }

    /**
     * 设置栈会起源状态
     * @param origin 
     */
    setOrigin(origin:string){
        this.lastText = origin;
        this.hasUndo = false;
        this.redoStack = [];
        this.undoStack = [];
    }

    /**
     * undo 操作
     */
    public undo(){

        
        const patch = this.undoStack.pop()
        this.redoStack.push(patch);
        if(!patch) return;

        //对当前状态应用补丁，将其回退到上一状态
        console.log(this.lastText);
        const res = this.dmp.patch_apply(patch,this.lastText)
        console.log(res);
        
        //重新设置last
        this.lastText = res[0]
        //跟新编译器当前文本
        this.editor.ir.rootElement.innerHTML = res[0]
        //刷新视图
        this.editor.ir.renderer.refreshEditorView(this.editor.ir.rootElement);
    }

    /**
     * redo 操作
     */
    public redo(){
        const patch = this.redoStack.pop()
        //重新放回undo
        this.undoStack.push(patch)


        if(!patch) return;
        //复制并反转补丁
        const redoPatch = this.dmp.patch_deepCopy(patch).reverse()
        redoPatch.forEach((patch) => {
            patch.diffs.forEach((diff) => {
                diff[0] = -diff[0];
            });
        });
        //对当前状态应用补丁，将其回退到后一状态
        const res = this.dmp.patch_apply(redoPatch,this.lastText)
        //重新设置last
        this.lastText = res[0]
        //跟新编译器当前文本
        this.editor.ir.rootElement.innerHTML = res[0]
    }

    public addUndo(){
        const cloneRoot =  this.editor.ir.rootElement.cloneNode(true) as HTMLElement
        //移除动态的
        const preList =  cloneRoot.getElementsByClassName("markdown-it-code-beautiful")
        for (let index = 0; index < preList.length; index++) {
            const element = preList[index];
            element.innerHTML = ""
        }
        
        
        //当前状态到上一状态的不同
       const diff = this.dmp.diff_main(cloneRoot.innerHTML,this.lastText)
       console.log(diff);
       //生成补丁
       const patch = this.dmp.patch_make(cloneRoot.innerHTML,diff)
       console.log(patch);
       if(patch.length === 0) return;
        
        

       //跟新lastText为当前状态
       this.lastText = cloneRoot.innerHTML;
       this.undoStack.push(patch)
       if(this.undoStack.length>this.stackSize){
        this.undoStack.shift();
       }
       if(this.undoStack.length >0){
        this.hasUndo = true;
       }else{
        this.hasUndo = false;
       }
       
       //添加undo应该舍弃掉redo里面的
       this.redoStack=[]
    }
}

export default IRUndo;