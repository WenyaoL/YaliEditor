
import {updateLine,updateBlock,updateMulLine} from '@/codemirror-main/codeCommon'



//-------------------------------内容加载处理------------------------------
function loadContentListener(store){
    const applicationContext = store.state.applicationContext

    //跟新上下文
    window.electronAPI.updateApplicationContext((event, context)=>{
        //跟新上下文
        store.commit('updateApplicationContext',context)
    })
    
    //保存文件回传处理
    window.electronAPI.saveFile((event,payload)=>{
        //回传信息
        if(payload){
            console.log('触发另存为');
            //回传上下文,设置另存路径
            
            event.sender.send('saveFile',{
                applicationContext:JSON.stringify(applicationContext),
                path:payload.path
            })
        }else{
            //保存按键
            //回传上下文
            event.sender.send('saveFile',{
                applicationContext:JSON.stringify(applicationContext),
                path: null,
            })
            store.commit('updateFileState',true) //跟新文件状态为已经保存
        }
        

    })
    
    //创建文件树
    window.electronAPI.createFileTree((event, payload)=>{
        store.commit('updateTree',payload.tree)
    })

    //测试
    window.electronAPI.test((event,payload)=>{
        console.log('测试，接收数据==',payload);
    })

}



//---------------------------viewEditor处理-----------------------------------
function loadViewEditorListener(store){
    window.electronAPI.createLine((event,payload)=>{
        //标题快捷键信息处理
        //payload.level
        updateLine(store.state.viewEditor,payload)
    })
    
    window.electronAPI.createType((event,payload)=>{
        //字体快捷键信息处理
        updateBlock(store.state.viewEditor,payload)
    })
    
    window.electronAPI.createBlock((event,payload)=>{
        updateBlock(store.state.viewEditor,payload)
    })
      
    window.electronAPI.createMulLine((event,payload)=>{
        updateMulLine(store.state.viewEditor,payload)
    })
}


function loadAll(store){

    loadContentListener(store)
    loadViewEditorListener(store)
}

export {loadAll,loadContentListener,loadViewEditorListener}
export default {loadAll,loadContentListener,loadViewEditorListener}

