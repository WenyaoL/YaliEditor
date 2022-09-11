<template>
  <div ref="doc" class="doc">
  </div>
</template>

<script>
import {basicSetup, EditorView} from "codemirror"
import {markdown} from "@codemirror/lang-markdown"
import {languages} from "@codemirror/language-data"

//import {tags} from "@lezer/highlight"
//import {HighlightStyle} from "@codemirror/language"
import {syntaxHighlighting,defaultHighlightStyle} from "@codemirror/language"
import {myHighlightStyle} from "@/codemirror-plugin/codeStyle/codeStyle"

export default {
    name:"MarkCodeMirrorArea",
    data(){
        return{
            doc: this.$store.state.content,
            myST: myHighlightStyle
        }
    },
    methods:{
        createArea(){
            
            const customTheme = EditorView.theme({
                '&.cm-editor.cm-focused': {
                    outline: "none"
                },
                '&':{
                    font: "16px Arial, monospace ",
                }
            })
            
            const markL = markdown({codeLanguages: languages})
            
            let view = new EditorView({
                doc: this.doc,
                extensions: [
                    basicSetup, 
                    customTheme,
                    markL,
                    syntaxHighlighting(this.myST)
                ],
                parent: this.$refs.doc,
            })
            
            
        }
    },
    mounted:function(){
        this.createArea();
    }

}
</script>

<style scoped>
div{
    height: 100%;
    text-align: left;

}
</style>