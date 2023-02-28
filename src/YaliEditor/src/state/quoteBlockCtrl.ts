

const quoteBlockCtrl = IRState => {
    
    IRState.prototype.quoteBlockDelete = function (mdBlock) {
        return true
    }

    IRState.prototype.quoteBlockEnter = function(mdBlock){
        return true
    }

    IRState.prototype.quoteBlockInput = function(mdBlock,mdInline,event){
        return true
    }
}

export default quoteBlockCtrl