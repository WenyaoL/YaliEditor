<template>
  <div class="markShow" ref="markShow">
    <div id="markShowcontent"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue';
// 引入默认样式
//import 'highlight.js/scss/default.scss'
//个性化样式
//import 'highlight.js/scss/github.scss'
import md from '../../YaliEditor/src/plugin/markdown-it-plugin/def'
import {
  init,
  classModule,
  styleModule,
  propsModule,
  attributesModule,
  eventListenersModule,
  toVNode,
  h,
  VNode
} from 'snabbdom'
import {useStore} from 'vuex'

export default {
  props: {
    content: String
  },
  setup(props, context) {
    const markShow = ref<HTMLElement>(null)
    let markdownNode: HTMLElement = null
    let markdownVnode = null
    const store = useStore()
    const patch = init([
      classModule,
      styleModule,
      attributesModule,
      eventListenersModule,
    ]);

    const render = (vnode: VNode) => {
      markdownVnode = patch(markdownVnode, vnode)
    }

    watch(() => props.content,
      (newValue, oldValue,onCleanup) => {
        if (newValue == oldValue) return
        let timer = setTimeout(() => {
          const root = markdownNode.cloneNode(false) as HTMLElement
          root.innerHTML = md.render(newValue)
          render(toVNode(root))
        },10)

        onCleanup(()=>{
          clearTimeout(timer)
          timer = null
        })
      })

    onMounted(() => {
      markShow.value.addEventListener("click", (ev: MouseEvent & { target: HTMLElement }) => {
        ev.preventDefault()
        if (ev.ctrlKey && ev.target.tagName == "A") {
          store.dispatch('openURL',ev.target.getAttribute("href"))
          ev.preventDefault()
        }
      })

      markdownNode = markShow.value.querySelector("#markShowcontent")
      markdownNode.innerHTML = md.render(props.content)
      markdownVnode = toVNode(markShow.value.firstElementChild)
    })

    return {
      render,
      markShow
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  text-align: left;
}

::v-deep blockquote {
  padding: 0 15px;
  color: #777777;
  border-left: 4px solid #dfe2e5;
  margin-left: 10px;
}

::v-deep * {
  height: 340;
  //margin: 5px;
}

// 添加行号样式
::v-deep .header-anchor {
  text-decoration: none;
  color: black;

  :hover {
    color: orange
  }
}

::v-deep .markdown-it-toc-beautiful {
  list-style: none;

  a {
    text-decoration: none;
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
  border: 1px solid #e7eaed;

  //max-height: 210px;
  code {
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

::v-deep img {
  display: block;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}

::v-deep p>code {
  border: 1px solid var(--yali-code-font-border-color);
  border-radius: 3px;
  color: var(--yali-code-font-color);
  background-color: var(--yali-code-font-background-color);
  font-size: large;
}
</style>