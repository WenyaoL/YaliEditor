<template>
    <codemirror
    id="code"
    ref="myCode"
    v-model="applicationContext.content"
    placeholder="code here"
    :style="{ height: '100%' }"
    :autofocus="true"
    :tab-size="2"
    :extensions="extensions"
    @change="updateContent"
    @ready="getContext($event)"
  />
</template>

<script lang="ts">
import {ref,onMounted,shallowRef,watch,defineComponent} from 'vue'
import {basicSetup} from "codemirror"
import { Codemirror } from 'vue-codemirror'
import { useStore } from 'vuex';
import {EditorSelection,Compartment,Prec} from "@codemirror/state"
import {EditorView,keymap} from "@codemirror/view"
import {defaultKeymap,indentWithTab} from '@codemirror/commands'

import {markdown} from "@codemirror/lang-markdown"
import {languages} from "@codemirror/language-data"
import { oneDark } from '@codemirror/theme-one-dark'
import {codeCompletions,updateBlock,createEditorCompartment} from '@/codemirror-plugin/util/Common'
import {syntaxHighlighting,defaultHighlightStyle} from "@codemirror/language"

export default defineComponent({
    components: {
      Codemirror
    },
    setup() {
      const store = useStore();
      const applicationContext = store.state.editorModule.applicationContext
      
      // Codemirror EditorView instance ref
      const view = shallowRef()
      const md = markdown({codeLanguages: languages})
      //code complete extensions
      const ext = md.language.data.of({
        autocomplete: codeCompletions
      })
      const keys =[
        {key: "Shift-Ctrl-k",run() { 
          updateBlock(store.state.editorModule.viewEditor,{type:"codeblock"}); 
          return true
        }},
        {key: "Shift-Ctrl-m",run() { 
          updateBlock(store.state.editorModule.viewEditor,{type:"mathblock"}); 
          return true
        }}
      ]

      let {compartment,run} = createEditorCompartment()

      let extensions = [
        md,
        ext,
        Prec.high(keymap.of(keys)),
        keymap.of([indentWithTab]),
        basicSetup,
        EditorView.lineWrapping,
      ]
      if(store.state.editorModule.applicationContext.theme == "dark"){
          extensions = extensions.concat([compartment.of(oneDark)])
      }

      function getContext(payload){
        store.commit('setViewEditor',payload.view)
        view.value = payload.view
      }

      const updateContent = (text)=>{
        let title = document.title
        if(title.charAt(title.length-1) !== "*"){
          document.title = title+"*"
        }
        //跟新文件状态
        store.commit('updateFileState',false)
        //跟新文本
        store.commit('updateContent',text)
      }


      watch(()=>store.state.editorModule.applicationContext.theme,(theme)=>{
        if(theme == "dark"){
          run(oneDark,view.value)
        }else{
          run([],view.value)
        }
      })


      return {
        extensions,
        getContext,
        updateContent,
        applicationContext,
        view
        
      }
    }
  })
</script>

<style scoped>
#code{
    height: 100%;
    width: 95%;
    text-align: left;
}
</style>