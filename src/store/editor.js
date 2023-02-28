/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { createStore } from 'vuex'
import { isEmpty } from '@/utils/common'

const editor = {
    state: () => ({
        viewEditor: null, //渲染进程的视图编辑器 （SV ONLY模式下的编辑器）
        yaliEditor: null, //
        editModel: "IR",  //编辑模式

        applicationContext: {   //上下文
            theme: "light",   //主题
            title: "Yalier",  //标题
            filePath: null,   //文件路径
            content: "",
            preview: "",
            tree: [],   //当前文件树
            isSave: true,
            outline: [],  //文档大纲
            recentDocuments: [], //最近打开文件
        },

        fonts: {        //jsPDF加载的字体数据
            normal: '',
            bold: ''
        },
    }),
    mutations: {
        updateContent(state, payload) {
            state.applicationContext.content = payload
        },
        updateTree(state, payload) {
            state.applicationContext.tree = payload
        },
        updatePreview(state, payload) {
            state.applicationContext.preview = payload
        },
        updateTitle(state, title) {
            if (title) {
                state.applicationContext.title = title
                document.title = title
            }
        },
        updateFilePath(state, payload) {
            state.applicationContext.filePath = payload
        },
        setViewEditor(state, payload) {
            state.viewEditor = payload
        },
        setYaliEditor(state, payload) {
            state.yaliEditor = payload
        },
        updateFileState(state, flag) {
            state.applicationContext.isSave = flag
            if (!flag && !document.title.endsWith("*")) {
                document.title = document.title + "*"
            } else if (flag && document.title.endsWith("*")) {
                document.title = document.title.slice(0, document.title.length - 1)
            }
        },
        updateEditModel(state, model) {
            state.editModel = model
        },
        updateApplicationContext(state, context) {
            if (isEmpty(context)) return
            const application = state.applicationContext
            //更新上下文
            Object.assign(application, context)
            document.title = application.title
        },
        initFonts(state, context) {
            state.fonts = context
        },
        updateOutline(state, heading) {
            state.applicationContext.outline = heading
        },
        updateTheme(state, theme) {
            state.applicationContext.theme = theme
        },
        updateRecentDocuments(state, recentDocuments) {
            state.applicationContext.recentDocuments = recentDocuments
        }
    },
    actions: {

    },
    getters: {}
}

export default editor