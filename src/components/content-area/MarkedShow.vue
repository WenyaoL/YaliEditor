<template>
  <div class="common-layout">
    <el-container >
      <el-aside width="50%">
        <!-- 书写区域 -->
        <textarea class="markdown-box-write" @input="writeChange"></textarea>
    </el-aside>
      <el-main>
        <!-- 编译区域 -->
        <div class="markdown-box-compile" v-html="content"></div></el-main>
    </el-container>
  </div>
</template>

<script>
import { marked } from 'marked'
import 'highlight.js/styles/monokai-sublime.css'

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const hljs = require('highlight.js')
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: '',
  mangle: true,
  pedantic: false,
  sanitize: false,
  silent: false,
  smartLists: false,
  smartypants: false,
  xhtml: false
})


export default {
    name:"MarkedShow",
    data(){
        return{
            content:""
        }
    },
    methods:{
        writeChange(e){
            const getTextArea = e.target
            this.content = marked.parse(getTextArea.value)
            console.log(this.content)
        }
    },
    mounted(){
    }
}
</script>

<style scoped>
div.common-layout{
    height: 100%;
}
main .el-main{
    padding-top: 0px;
    padding-bottom: 0px;
    height: 100%;
    text-align: left;
}
.markdown-box-write{
    height: 98%;
    width: 95%;
    margin: 1px;
}

.el-container{
    height: 100%;
}
</style>