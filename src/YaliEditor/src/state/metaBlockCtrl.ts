

const metaBlockCtrl = IRState => {
    
    IRState.prototype.metaBlockDelete = function (mdBlock) {
        return false
    }

    IRState.prototype.metaBlockEnter = function(mdBlock){
        this.editor.domTool.insertTextNodeAtCursor("\n")
        return true
    }

    IRState.prototype.metaBlockInput = function(mdBlock,mdInline,event){
        return false
    }
}

export default metaBlockCtrl