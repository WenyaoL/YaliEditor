/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { diff_match_patch, patch_obj } from 'diff-match-patch';
import YaLiEditor from '..';
import rangy from 'rangy';
import { IRfindClosestMdBlock } from '../util/findElement'
import { toVNode, patch } from '../snabbdom'
import { VNode } from 'snabbdom';

/**
 * 历史记录
 */
class History {

    //补丁(历史补丁)
    public patch: patch_obj[];
    //光标记录
    public bookMark: any;
    public secondBookMark: any;


    constructor(patch?: patch_obj[], bookMark?: any, secondBookMark?: any) {
        this.patch = patch
        this.bookMark = bookMark
        this.secondBookMark = secondBookMark
    }
}

/**
 * IR模式下的undo处理器(利用snabbdom优化)
 */
class IRUndo {
    //差异识别工具
    dmp: diff_match_patch;

    //undo and redo stack size
    stackSize = 80;

    hasUndo: boolean;
    //记录最后一次文本(包含codemirror的代码的文本)
    lastText: string;
    //记录最后一次VNode(包含codemirror的代码的文本)
    lastVNode: VNode;

    redoStack: History[];
    undoStack: History[];

    editor: YaLiEditor;
    constructor(editor: YaLiEditor, origin: string) {
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
    setOrigin(origin: string) {

        this.lastText = origin;
        this.hasUndo = false;
        this.redoStack = [];
        this.undoStack = [];

    }

    setRootOrigin(root: HTMLElement) {
        this.editor.markdownTool.removeAllCodemirror6Element(root)
        this.editor.markdownTool.fixCodemirror6Element(root)
        this.editor.markdownTool.removeAllFocusStyle(root)
        this.lastText = root.innerHTML
        this.hasUndo = false;
        this.redoStack = [];
        this.undoStack = [];
    }


    private IRHistoryUndo(history: History) {
        /*const { vnode, bookMark, secondBookMark } = history
        console.log("要undo的vnode", vnode);

        //跟新视图
        patch(toVNode(this.editor.ir.rootElement), vnode)
        this.lastVNode = vnode
        //刷新视图
        this.editor.ir.renderer.refreshEditorView(this.editor.ir.rootElement);
        //重新设置光标
        let sel = rangy.getSelection()
        if (bookMark) {
            bookMark.rangeBookmarks[0].containerNode = this.editor.ir.rootElement
            sel.moveToBookmark(bookMark)
        }
        let r = sel.getRangeAt(0)
        let block = IRfindClosestMdBlock(r.startContainer)
        //当光标是聚合的时候，开启二级定位，提供更加准确的定位
        if (block && r.collapsed) {
            secondBookMark.rangeBookmarks[0].containerNode = block
            sel.moveToBookmark(secondBookMark)
        }

        this.editor.ir.focueProcessor.updateFocusElementByRoot()*/
    }

    /**
     * undo 操作
     */
    public undo() {
        this.editor.ir.observer.clear()


        const history = this.undoStack.pop()
        if (!history) return;

        this.redoStack.push(history)
        this.IRHistoryUndo(history)
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
    }

    private IRHistoryRedo(history: History) {
        /*const { vnode, bookMark, secondBookMark } = history

        //跟新视图
        patch(toVNode(this.editor.ir.rootElement), vnode)
        this.lastVNode = vnode

        //刷新视图
        this.editor.ir.renderer.refreshEditorView(this.editor.ir.rootElement);
        //重新设置光标
        let sel = rangy.getSelection()
        if (bookMark) {
            bookMark.rangeBookmarks[0].containerNode = this.editor.ir.rootElement
            sel.moveToBookmark(bookMark)
        }
        let r = sel.getRangeAt(0)
        let block = IRfindClosestMdBlock(r.startContainer)
        //当光标是聚合的时候，开启二级定位，提供更加准确的定位
        if (block && r.collapsed) {
            secondBookMark.rangeBookmarks[0].containerNode = block
            sel.moveToBookmark(secondBookMark)
        }

        this.editor.ir.focueProcessor.updateFocusElementByRoot()*/
    }

    /**
     * redo 操作
     */
    public redo() {
        const history = this.redoStack.pop()
        if (!history) return;
        //重新放回undo
        this.undoStack.push(history)

        this.IRHistoryRedo(history)
        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
    }


    public addIRHistory() {
/*

        //释放修改锁
        this.editor.ir.focueProcessor.releaseModifyLock()
        const cloneRoot = this.editor.ir.rootElement.cloneNode(true) as HTMLElement
        //移除codemirror代码
        this.editor.markdownTool.removeAllCodemirror6Element(cloneRoot)
        this.editor.markdownTool.fixCodemirror6Element(cloneRoot)
        this.editor.markdownTool.removeAllFocusStyle(cloneRoot)

        //toVNode
        const vnode = toVNode(cloneRoot)

        //创建历史记录
        let mark = this.editor.ir.focueProcessor.getModifyBeforeBookmark()
        let secondBookMark = this.editor.ir.focueProcessor.getModifyBeforeSecondBookmark()
        const history = new History(this.lastVNode, mark, secondBookMark)

        this.lastVNode = vnode

        this.undoStack.push(history)
        if (this.undoStack.length > this.stackSize) {
            this.undoStack.shift();
        }
        if (this.undoStack.length > 0) {
            this.hasUndo = true;
        } else {
            this.hasUndo = false;
        }
        //添加undo应该舍弃掉redo里面的
        this.redoStack = []
        this.editor.ir.isChange = true
*/
    }


}

export default IRUndo;