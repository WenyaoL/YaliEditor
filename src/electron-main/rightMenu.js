import electron from 'electron'

export default {
    build(win){
        var rightTemplate = [
            {
                label:'右键菜单'
            }
        ]
        var rightm = electron.Menu.buildFromTemplate(rightTemplate)
        console.log();
        win.webContents.on('context-menu',(e)=>{
            e.preventDefault()
            rightm.popup({window:win})
        })
    }

}




/*
window.addEventListener('contextmenu',(e)=>{
    e.preventDefault()
    rightm.popup({
        window:rightm.getCurrentWindow()
    })
})
*/

