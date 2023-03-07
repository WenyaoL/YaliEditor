

const quoteBlockCtrl = IRState => {
    
    IRState.prototype.quoteBlockDelete = function (mdBlock) {
        return false
    }

    IRState.prototype.quoteBlockEnter = function(mdBlock){
        
        return false
    }

    IRState.prototype.quoteBlockInput = function(mdBlock,mdInline,event){
        return false
    }
}

export default quoteBlockCtrl