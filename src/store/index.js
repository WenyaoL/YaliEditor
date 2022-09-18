import { createStore } from 'vuex'
import {isEmpty} from '@/utils/common'
export default createStore({
  state: {
    viewEditor:null, //渲染进程的视图编辑器 （SV ONLY模式下的编辑器）
    yaliEditor:null,
    applicationContext:{   //上下文
      title:"undefine",
      filePath: null,   //文件路径
      content:"",
      preview:"",  
      tree:[],   //当前文件树
      isSave:true
    },
    editModel:"IR",  //编辑模式
    fonts:{        //jsPDF加载的字体数据
      normal:'',
      bold:''  
    }
  },
  getters: {

  },
  mutations: {
    updateContent(state,payload){
      console.log("跟新文本内容");
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
      state.viewEditor = payload
    },
    setYaliEditor(state,payload){
      state.yaliEditor = payload
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
      if(context.title){
        application.title = context.title
        document.title = context.title
      } 
      if(context.content) application.content = context.content
      if(context.isSave) application.isSave = context.isSave
      if(!isEmpty(context.tree))application.tree = context.tree
      if(context.preview) application.preview = context.preview
    },
    initFonts(state,context){
      state.fonts = context
    }
  },
  actions: {

  },
  modules: {

  }
})
