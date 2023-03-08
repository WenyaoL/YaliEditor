/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { createStore } from 'vuex'
import editor from './editor'
import preference from './preference'

const store = createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getShortKeyMap(store) {
      return window.electronAPI.INVOKE.getKeyMap()
    },
    readFile(store, filePath) {
      return window.electronAPI.INVOKE.readFile({ filePath })
    },
    openURL(store, url) {
      window.electronAPI.SEND.openURL({ url })
    },
    saveFile(store, savePath) {
      window.electronAPI.SEND.saveFile({
        applicationContext: JSON.stringify(store.state.editorModule.applicationContext),
        savePath
      })
      store.commit('updateFileState',true)
    },
    addRecentDocument(store, { filePath, description }) {
      window.electronAPI.SEND.addRecentDocument({ filePath, description })
    },
    openFileInNewWindow(store, filePath) {
      window.electronAPI.SEND.openFileInNewWindow({ filePath })
    },
    getRecentDocuments() {
      return window.electronAPI.INVOKE.getRecentDocuments()
    },
    getFontsDate() {
      return window.electronAPI.INVOKE.getFontsData()
    },
    setShortKeyMap(store, keyMap) {
      return window.electronAPI.SEND.setKeyMap(keyMap)
    },
    clearDataCache(){
      window.electronAPI.SEND.clearDataCache()
    },
    updateLocale(store, locale){
      window.electronAPI.SEND.updateCurrLocale(locale)
    }
  },
  modules: {
    editorModule:editor,
    preferenceModule:preference
  }
})


export default store
