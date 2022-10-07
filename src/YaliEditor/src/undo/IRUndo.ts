/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import {diff_match_patch,patch_obj} from 'diff-match-patch';
import YaLiEditor from '..';
import rangy from 'rangy';
import {IRfindClosestMdBlock} from '../util/findElement'
const enum HistoryType {
    CodemirrorHistory,
    IRHistory
}

/**
 * 历史记录
 */
class History{
    //历史类型
    public type:HistoryType;

    //补丁(历史补丁)
    public patch: patch_obj[];
    //光标记录
    public bookMark:any;
    public secondBookMark:any;

    //codemirror History
    public codemirrorHistory:{id:string}

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
    stackSize = 100;

    hasUndo:boolean;
    //记录最后一次文本(不包含codemirror的代码的文本)
    lastText: string;
    //记录最后一次的光标位置(记录的是在codemirror代码块移除前的位置)
    lastBookMark: any;

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

    private codemirrorHistoryUndo(history:History){
        let id = history.codemirrorHistory.id
        let keyboardEvent = new InputEvent("beforeinput",{
            inputType:"historyUndo"
        })
        let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(id)
        viewInfo.view.focus()
        document.getElementById(id).getElementsByClassName("cm-content").item(0).dispatchEvent(keyboardEvent)
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
        
        history.bookMark.rangeBookmarks[0].containerNode = this.editor.ir.rootElement
        sel.moveToBookmark(history.bookMark)
        let r = sel.getRangeAt(0)
        let block = IRfindClosestMdBlock(r.startContainer)

        
        history.secondBookMark.rangeBookmarks[0].containerNode = block

        //rangy.getSelection().moveToBookmark(history.bookMark)
        //sel.moveToBookmark(history.secondBookMark)
        
    }   

    /**
     * undo 操作
     */
    public undo(){

        
        const history = this.undoStack.pop()
        if(!history) return;

        this.redoStack.push(history);
        if(history.type == HistoryType.CodemirrorHistory){
            this.codemirrorHistoryUndo(history)
            return
        }

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

    private codemirrorHistoryRedo(history:History){
        let id = history.codemirrorHistory.id
        let keyboardEvent = new InputEvent("beforeinput",{
            inputType:"historyRedo"
        })
        let viewInfo = this.editor.ir.renderer.codemirrorManager.getViewInfo(id)
        viewInfo.view.focus()
        document.getElementById(id).getElementsByClassName("cm-content").item(0).dispatchEvent(keyboardEvent)
    }

    /**
     * redo 操作
     */
    public redo(){
        const history = this.redoStack.pop()
        if(!history) return;
        //重新放回undo
        this.undoStack.push(history)

        if(history.type == HistoryType.CodemirrorHistory){
            this.codemirrorHistoryRedo(history)
            return
        }

        this.IRHistoryRedo(history)
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
        
    }

    public addCodemirrorHistory(uuid:string){
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
        let history = new History()
        history.type = HistoryType.CodemirrorHistory
        history.codemirrorHistory = {id:uuid}
        this.undoStack.push(history)
    }

    public addIRHistory(){
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
        const cloneRoot =  this.editor.ir.rootElement.cloneNode(true) as HTMLElement
        //移除动态的
        let preList =  cloneRoot.getElementsByClassName("markdown-it-code-beautiful")
        for (let index = 0; index < preList.length; index++) {
            const element = preList.item(index);
            element.innerHTML=""
        }
        preList = cloneRoot.getElementsByClassName("md-mathblock-input")
        for (let index = 0; index < preList.length; index++) {
            const element = preList.item(index);
            element.innerHTML=""
        }


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
     * 强制刷新
     * 1 <- 2(last)
     * 
     * 1 <- 2(codemirrorHistory)
     * 1 <- 2(codemirrorHistory) <- 3(now)
     * 强制刷新
     * 1 <- 2(codemirrorHistory) <- 3(last)
     */
    adjust(){
        if(this.undoStack.length<=0) return

        /*if(this.undoStack.length == 1){
            this.addIRHistory()
            return
        }*/

        const cloneRoot =  this.editor.ir.rootElement.cloneNode(true) as HTMLElement
        //移除动态的
        const preList =  cloneRoot.getElementsByClassName("markdown-it-code-beautiful")
        for (let index = 0; index < preList.length; index++) {
            const element = preList[index];
            element.innerHTML = ""
        }

        const nowText = cloneRoot.innerHTML
        
        //获取上一个历史状态（1<-2）
        const lastHistory = this.undoStack.pop()
        if(lastHistory.type == HistoryType.CodemirrorHistory){
            this.undoStack.push(lastHistory)
            this.addIRHistory()
            return
        }
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

    /**
     * update bookmark
     */
    /*updateBookmark(){
        this.lastBookMark = rangy.getSelection().getBookmark(this.editor.ir.rootElement)
    }*/
}

export default IRUndo;