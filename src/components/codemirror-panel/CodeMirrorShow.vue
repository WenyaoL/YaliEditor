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
    @change="updateContent($event)"
    @ready="getContext($event)"
  />
</template>

<script>
import {ref,onMounted} from 'vue'
import {basicSetup} from "codemirror"
import { Codemirror } from 'vue-codemirror'
import { useStore } from 'vuex';
import {EditorSelection,Compartment,Prec} from "@codemirror/state"
import {EditorView,keymap} from "@codemirror/view"
import {defaultKeymap,indentWithTab} from '@codemirror/commands'

import {markdown} from "@codemirror/lang-markdown"
import {languages} from "@codemirror/language-data"
import { oneDark } from '@codemirror/theme-one-dark'
import {codeCompletions} from '@/codemirror-plugin/codeCompletions'
import {updateBlock} from '@/codemirror-plugin/codeCommon'

import {syntaxHighlighting,defaultHighlightStyle} from "@codemirror/language"

export default {
    components: {
      Codemirror
    },
    setup() {
      const store = useStore();
      const applicationContext = store.state.applicationContext
      const myCode = ref(null)
      const md = markdown({codeLanguages: languages})
      //code complete extensions
      const ext = md.language.data.of({
        autocomplete: codeCompletions
      })

      const keys =[
        {key: "Shift-Ctrl-k",run() { 
          updateBlock(store.state.viewEditor,{type:"codeblock"}); 
          return true
        }},
        {key: "Shift-Ctrl-m",run() { 
          updateBlock(store.state.viewEditor,{type:"mathblock"}); 
          return true
        }}
      ]

      //extensions arrays false
      let extensions = [
        md,
        ext,
        //syntaxHighlighting(myHighlightStyle),
        //oneDark,
        Prec.high(keymap.of(keys)),
        keymap.of([indentWithTab]),
        basicSetup,
        EditorView.lineWrapping,
      ]
      if(store.state.theme == "dark"){
        extensions = extensions.concat([oneDark])
      }

      function getContext(payload){
        store.commit('setViewEditor',payload.view)
      }

      function updateContent(text){
        let title = document.getElementsByTagName("title")[0].innerText
        if(title.charAt(title.length-1) !== "*"){
          document.getElementsByTagName("title")[0].innerText = title+"*"
        }
        //跟新文件状态
        store.commit('updateFileState',false)
        //跟新文本
        store.commit('updateContent',text)
      }

      onMounted(()=>{        
      });
      return {
        extensions,
        getContext,
        updateContent,
        applicationContext,
        myCode,
        
      }
    }
  }
</script>

<style scoped>
#code{
    height: 100%;
    width: 95%;
    text-align: left;
}
</style>