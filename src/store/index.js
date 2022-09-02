import { createStore } from 'vuex'
import {isEmpty} from '@/utils/common'
export default createStore({
  state: {
    viewEditor:null, //渲染进程的视图编辑器
    applicationContext:{   //上下文
      title:"undefine",
      filePath: null,   //文件路径
      content:"",
      preview:"",  
      tree:[],   //当前文件树
      isSave:true
    },
    editModel:"ir"
  },
  getters: {

  },
  mutations: {
    updateContent(state,payload){
      state.applicationContext.content = payload
    },
    updateTree(state,payload){
      state.applicationContext.tree = payload
    },
    updatePreview(state,payload){
      state.applicationContext.preview = payload
    },
    updateFilePath(state,payload){
      state.applicationContext.filePath = payload
    },
    setViewEditor(state,payload){
      console.log("设置编辑器==",payload);
      state.viewEditor = payload
    },
    updateFileState(state,flag){
      state.applicationContext.isSave = flag
    },
    updateEditModel(state,model){
      state.editModel = model
    },
    updateApplicationContext(state,context){
      if(isEmpty(context)) return 
      const application = state.applicationContext
      //更新上下文
      if(context.filePath) application.filePath = context.filePath
      if(context.title) application.title = context.title
      if(context.content) application.content = context.content
      if(context.isSave) application.isSave = context.isSave
      if(!isEmpty(context.tree))application.tree = context.tree
      if(context.preview) application.preview = context.preview
    }
  },
  actions: {

  },
  modules: {

  }
})
