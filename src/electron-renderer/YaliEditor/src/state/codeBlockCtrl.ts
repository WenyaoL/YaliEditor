

const codeBlockCtrl = IRState => {
    
    IRState.prototype.codeBlockDelete = function (mdBlock) {
        return false
    }

    IRState.prototype.codeBlockEnter = function(mdBlock){
        this.editor.domTool.insertTextNodeAtCursor("\n")
        return true
    }

    IRState.prototype.codeBlockInput = function(mdBlock,mdInline,event){
        return false
    }
}

export default codeBlockCtrl