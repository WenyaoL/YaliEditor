/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
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
      isSave:true,
      outline:[]  //文档大纲
    },
    editModel:"IR",  //编辑模式
    fonts:{        //jsPDF加载的字体数据
      normal:'',
      bold:''  
    },
    sideBarFold:true
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
      state.viewEditor = payload
    },
    setYaliEditor(state,payload){
      state.yaliEditor = payload
    },
    updateFileState(state,flag){
      state.applicationContext.isSave = flag
      if(!flag && !document.title.endsWith("*")){
        document.title = document.title+"*"
      }else if(flag && document.title.endsWith("*")){
        document.title = document.title.slice(0,document.title.length-1)
      }
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
    },
    updateSideBarFold(state,flag){
      state.sideBarFold = flag
    },
    updateOutline(state,heading){
      state.applicationContext.outline = heading
    }
  },
  actions: {

  },
  modules: {

  }
})
