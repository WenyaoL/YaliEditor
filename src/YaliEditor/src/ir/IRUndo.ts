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

    constructor(){
        this.hasUndo = false;
        this.lastText = "";
        this.redoStack = [];
        this.undoStack = [];

        this.dmp = new diff_match_patch();
    }

    /**
     * undo 操作
     */
    public undo(editor:YaLiEditor){
        const patch = this.undoStack.pop()
        this.redoStack.push(patch);
        if(!patch) return;

        //对当前状态应用补丁，将其回退到上一状态
        const res = this.dmp.patch_apply(patch,this.lastText)
        //重新设置last
        this.lastText = res[0]
        //跟新编译器当前文本
        editor.ir.rootElement.innerHTML = res[0]


    }

    /**
     * redo 操作
     */
    public redo(editor:YaLiEditor){
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
        editor.ir.rootElement.innerHTML = res[0]
    }

    public addUndo(editor:YaLiEditor){

        //当前状态到上一状态的不同
       const diff = this.dmp.diff_main(editor.ir.rootElement.innerHTML,this.lastText)
       //生成补丁
       const patch = this.dmp.patch_make(editor.ir.rootElement.innerHTML,diff)
       
       if(patch.length === 0) return;
        
        

       //跟新lastText为当前状态
       this.lastText = editor.ir.rootElement.innerHTML;
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