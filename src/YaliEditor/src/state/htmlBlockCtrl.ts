

const htmlBlockCtrl = IRState => {
    
    IRState.prototype.htmlBlockDelete = function (mdBlock) {
        return true
    }

    IRState.prototype.htmlBlockEnter = function(mdBlock){
        return true
    }

    IRState.prototype.htmlBlockInput = function(mdBlock,mdInline,event){
        return true
    }

    
}

export default htmlBlockCtrl