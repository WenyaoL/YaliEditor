
const mathBlockCtrl = IRState => {
    
    IRState.prototype.mathBlockDelete = function (mdBlock) {
        return false
    }

    IRState.prototype.mathBlockEnter = function(mdBlock){
        return false
    }

    IRState.prototype.mathBlockInput = function(mdBlock,mdInline,event){
        return true
    }
}

export default mathBlockCtrl