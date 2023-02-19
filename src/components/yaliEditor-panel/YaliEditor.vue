<template>

  <div id="YaliEditor" ref="ccode" @contextmenu.prevent="onContextmenu"></div>
</template>


<script lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import YaLiEditor from '@/YaliEditor/src'
import Constants from '@/YaliEditor/src/constant/constants'
import ContextMenu from '@imengyu/vue3-context-menu'
import { createCommonItems } from './tipitemsCommon'
import { exec } from './utils'

import { getCurrentInstance } from 'vue';
import { EditorConfig } from '@/YaliEditor/src/options'
import bus from '../../bus'
export default {
  props: {
    content: String,
    disableEdit: Boolean,
  },
  setup(props, context) {
    const store = useStore();
    let yali: YaLiEditor = null;
    let yaliconfig:EditorConfig = null

    bus.on('yali:updateKeyMap',(keyMap:any)=>{
      yali.options.commonConfig.setKeyMap(keyMap)
    })

    

    function onContextmenu(e: MouseEvent) {
      let editor: YaLiEditor = store.state.editorModule.yaliEditor;
      exec(editor, e)
      e.preventDefault();
    }
    onMounted(() => {
      yaliconfig = EditorConfig.defalut()
        .ir
        .setDisableEdit(props.disableEdit)
        .setTheme(store.state.editorModule.applicationContext.theme)
        .end()

      yali = new YaLiEditor("YaliEditor", yaliconfig)
      //注册监听事件
      yali.ir.applicationEventPublisher.subscribe("refreshedToc", (headings: any) => {
        store.commit("updateOutline", headings)
      })
      yali.ir.applicationEventPublisher.subscribe("GET-CurrFilePath", () => {
        yali.ir.applicationEventPublisher.publish("RETURN-CurrFilePath", store.state.editorModule.applicationContext.filePath)
      })
      yali.ir.applicationEventPublisher.subscribe("yali::addIRHistory",()=>{
        store.commit('updateFileState', false)
      })
      
      yali.ir.applicationEventPublisher.subscribe('yali::openFile',(filePath)=>{
        store.dispatch('openFileInNewWindow',filePath)
      })

      yali.render(store.state.editorModule.applicationContext.content)
      store.commit('setYaliEditor', yali)
      store.dispatch('getShortKeyMap').then(keyMap=>{
        yali.options.commonConfig.setKeyMap(keyMap)
      })
    })




    watch(() => store.state.editorModule.applicationContext.content, (newValue) => {
      yali.render(newValue)
    })

    onBeforeUnmount(() => {
      store.commit('updateContent', yali.getMarkdownText())
    })
    return {
      onContextmenu,
    }
  }
}
</script>

<style>
#YaliEditor {
  text-align: left;
  outline: none;
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>