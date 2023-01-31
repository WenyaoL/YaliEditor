/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {diff_match_patch,patch_obj} from 'diff-match-patch';
import YaLiEditor from '..';
import rangy from 'rangy';
import {IRfindClosestMdBlock} from '../util/findElement'


/**
 * 历史记录
 */
class History{

    //补丁(历史补丁)
    public patch: patch_obj[];
    //光标记录
    public bookMark:any;
    public secondBookMark:any;


    constructor(patch?:patch_obj[],bookMark?:any,secondBookMark?:any){
        this.patch = patch
        this.bookMark = bookMark
        this.secondBookMark = secondBookMark
    }
}

/**
 * IR模式下的undo处理器
 */
class IRUndo{
    //差异识别工具
    dmp:diff_match_patch;

    //undo and redo stack size
    stackSize = 80;

    hasUndo:boolean;
    //记录最后一次文本(包含codemirror的代码的文本)
    lastText: string;
    //记录最后一次的光标位置(记录的是在codemirror代码块移除前的位置)
    //lastBookMark: any;

    redoStack: History[];
    undoStack: History[];

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

    setRootOrigin(root:HTMLElement){
        this.editor.markdownTool.removeAllCodemirror6Element(root)
        this.editor.markdownTool.fixCodemirror6Element(root)
        this.editor.markdownTool.removeAllFocusStyle(root)
        this.lastText = root.innerHTML        
        this.hasUndo = false;
        this.redoStack = [];
        this.undoStack = [];
    }


    private IRHistoryUndo(history:History){

        //对当前状态应用补丁，将其回退到上一状态
        const res = this.dmp.patch_apply(history.patch,this.lastText)

        
        //重新设置last
        this.lastText = res[0]

        //跟新编译器当前文本
        this.editor.ir.rootElement.innerHTML = res[0]


        //刷新disable的视图
        //this.editor.ir.renderer.codemirrorManager.refreshDisableEditorViewSyn(this.editor.ir.rootElement)

        //刷新视图
        this.editor.ir.renderer.refreshEditorView(this.editor.ir.rootElement);

        //重新设置光标
        let sel = rangy.getSelection()
        if(history.bookMark){
            history.bookMark.rangeBookmarks[0].containerNode = this.editor.ir.rootElement
            sel.moveToBookmark(history.bookMark)
        }
        let r = sel.getRangeAt(0)
        let block = IRfindClosestMdBlock(r.startContainer)
        //当光标是聚合的时候，开启二级定位，提供更加准确的定位
        if(block && r.collapsed){
            history.secondBookMark.rangeBookmarks[0].containerNode = block
            sel.moveToBookmark(history.secondBookMark)
        }

        this.editor.ir.focueProcessor.updateFocusElementByRoot()
        //rangy.getSelection().moveToBookmark(history.bookMark)
    }   

    /**
     * undo 操作
     */
    public undo(){
        this.editor.ir.observer.flushNow()

        const history = this.undoStack.pop()
        if(!history) return;

        this.redoStack.push(history);

        this.IRHistoryUndo(history)
        
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
    }

    private IRHistoryRedo(history:History){
        //复制并反转补丁
        const redoPatch = this.dmp.patch_deepCopy(history.patch).reverse()
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
        

        //刷新disable的视图
        //this.editor.ir.renderer.codemirrorManager.refreshDisableEditorViewSyn(this.editor.ir.rootElement)
        //刷新视图
        this.editor.ir.renderer.refreshEditorView(this.editor.ir.rootElement);
        //重新设置光标
        history.bookMark.rangeBookmarks[0].containerNode = this.editor.ir.rootElement
        rangy.getSelection().moveToBookmark(history.bookMark)
    }

    /**
     * redo 操作
     */
    public redo(){
        const history = this.redoStack.pop()
        if(!history) return;
        //重新放回undo
        this.undoStack.push(history)

        this.IRHistoryRedo(history)
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
        
    }


    public addIRHistory(){
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
        const cloneRoot =  this.editor.ir.rootElement.cloneNode(true) as HTMLElement

        //移除codemirror代码
        this.editor.markdownTool.removeAllCodemirror6Element(cloneRoot)
        this.editor.markdownTool.fixCodemirror6Element(cloneRoot)
        this.editor.markdownTool.removeAllFocusStyle(cloneRoot)

        

        //当前状态到上一状态的不同
        const diff = this.dmp.diff_main(cloneRoot.innerHTML,this.lastText)
       //生成补丁
        const patch = this.dmp.patch_make(cloneRoot.innerHTML,diff)
        if(patch.length === 0) return;

        
        //创建历史记录
        let mark = this.editor.ir.focueProcessor.getModifyBeforeBookmark()
        let secondBookMark = this.editor.ir.focueProcessor.getModifyBeforeSecondBookmark()
        
        const history = new History(patch,mark,secondBookMark)


       //跟新lastText为当前状态
       this.lastText = cloneRoot.innerHTML;
       this.undoStack.push(history)
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
       this.editor.ir.isChange=true
       this.editor.ir.undoAddListener(this.editor)

       
    }

    /**
     * 对当前undo栈的栈帧历史进行调整，
     * 将当前状态更改合并到最后一次更改中
     * 1 <- 2(last)
     * 1 <- 2 <- 3(now)
     * 合并成:
     * 1 <- 3(last)
     * 
     * 1(last)
     * 1 <- 2(now)
     */
    adjust(){
        if(this.undoStack.length<=0) return

        /*if(this.undoStack.length == 1){
            this.addIRHistory()
            return
        }*/

        const cloneRoot =  this.editor.ir.rootElement.cloneNode(true) as HTMLElement
        this.editor.markdownTool.removeAllCodemirror6Element(cloneRoot)
        this.editor.markdownTool.fixCodemirror6Element(cloneRoot)

        const nowText = cloneRoot.innerHTML
        
        //获取上一个历史状态（1<-2）
        const lastHistory = this.undoStack.pop()

        const res = this.dmp.patch_apply(lastHistory.patch,this.lastText)

        //当前状态到上上一状态的不同
        const diff = this.dmp.diff_main(nowText,res[0])
       //生成补丁
        const patch = this.dmp.patch_make(nowText,diff)

        //无效合并
        if(patch.length === 0) {
            this.undoStack.push(lastHistory)
            return;
        }


        //跟新lastText为当前状态
        this.lastText = nowText;
  
        this.undoStack.push(new History(patch,lastHistory.bookMark,lastHistory.secondBookMark))

        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
    }

}

export default IRUndo;