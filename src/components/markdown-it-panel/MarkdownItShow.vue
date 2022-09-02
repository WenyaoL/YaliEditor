<template>
    <div class="markShow" v-html="render(content)" >
    </div>
</template>

<script>
import {onMounted} from 'vue';
import MarkdownIt from 'markdown-it';
//import { highlighter } from '@/codemirror-main/codeStyle/codeStyle';
// 引入默认样式
//import 'highlight.js/scss/default.scss'
// 引入个性化的vs2015样式
//import 'highlight.js/styles/vs2015.css'
import md from '@/markdown-it-plugin/def'
import string from 'string'



export default {
    props:{
        content: String
    },
    setup(){
      const legacySlugify = s => string(s).slugify().toString()

      const render = (text)=>{
        
        return md.render(text)
      }
      onMounted(() => {
        
      })
      return{
        render
      }
    }
}
</script>

<style lang="scss" scoped>
//@import 'highlight.js/styles/vs2015.css';

div{
    text-align: left;
}

::v-deep blockquote{
  padding: 0 15px;
  color: #777777;
  border-left: 4px solid #dfe2e5;
  margin-left: 10px;
}

::v-deep *{
    height: 340;
    //margin: 5px;
}

// 添加行号样式
::v-deep pre.hljs::-webkit-scrollbar
{
    width:3px;
    height:8px;
    background-color:#F5F5F5;
}
::v-deep pre.hljs::-webkit-scrollbar-track
{
    -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
    border-radius:5px;
    background-color:#F5F5F5;
}
::v-deep pre.hljs::-webkit-scrollbar-thumb
{
    border-radius: 5px;
    background-color: rgb(204, 201, 201);
}
::v-deep .header-anchor{
  text-decoration: none;
  color: black;
  :hover {color:orange} 
}
::v-deep .markdown-it-toc-beautiful{
  list-style: none;
  a{
    text-decoration:none;
    color: #4183C4;
  }
}
// 添加行号样式
::v-deep pre.hljs {
  padding: 4px 2px;
  display: flex;
  position: relative;
  overflow: auto;
  font-size: 13.5px;
  //max-height: 210px;
  code{
    margin-left: 8px;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    border-right-style: solid;
    border-width: 1.5px;
    text-align: center;
    font-weight: bold;
    li {
      //list-style: decimal-leading-zero;
      position: relative;
      padding-left: 10px;
    }
  }
  b.name {
    top: 2px;
    position: absolute;
    z-index: 10;
    color: #999;
    pointer-events: none;
  }
}

::v-deep img{
  display: block;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>