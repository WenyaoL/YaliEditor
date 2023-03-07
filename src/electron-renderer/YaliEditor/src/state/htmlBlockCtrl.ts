

const htmlBlockCtrl = IRState => {
    
    IRState.prototype.htmlBlockDelete = function (mdBlock) {
        return false
    }

    IRState.prototype.htmlBlockEnter = function(mdBlock){
        return false
    }

    IRState.prototype.htmlBlockInput = function(mdBlock,mdInline,event){
        return true
    }

    
}

export default htmlBlockCtrl