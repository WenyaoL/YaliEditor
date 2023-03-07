<template>
  <div class="common-layout home" v-show="show">
    <dialog-tip id="dialog-tip" :displayButton="false" />
    <el-container>
      <el-aside :width="sideBarWidth + 'px'">
        <el-container>
          <!--侧边栏菜单-->
          <el-aside :width="'64px'">
            <LeftMenu :sideBarFlag="sideBarFlag" @update:sideBarFlag="updateSideBarFlag" />
          </el-aside>
          <!--这里应该渲染工具-->
          <el-main class="tool-bar">
            <ToolPanelView />
          </el-main>

        </el-container>
      </el-aside>

      <el-divider :direction="'vertical'" @mousedown="reSize" />

      <el-main>
        <FileContentView />
      </el-main>
    </el-container>



  </div>

</template>

<script lang="ts" setup>
// @ is an alias to /src
import LeftMenu from '../components/editor-home/LeftMenu.vue';
import DialogTip from '../components/editor-home/DialogTip.vue';
import FileContentView from './FileContentView.vue'
import ToolPanelView from './ToolPanelView.vue';
import bus from '../bus'
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const sideBarFlag = ref("fold")
const sideBarWidth = ref(64)
const oldSideBarWidth = ref(320)
const show = ref(false)

bus.on("Home-show",()=>{
  show.value = true
})

function reSize(event: MouseEvent) {
  const oldClientX = event.clientX
  const oldSideBarWidth = sideBarWidth.value
  document.onmousemove = (event: MouseEvent) => {
    const newSideBarWidth = oldSideBarWidth + (event.clientX - oldClientX)
    if (newSideBarWidth > 120) {
      sideBarWidth.value = newSideBarWidth
      sideBarFlag.value = 'expand'
    }
    else {
      sideBarWidth.value = 64
      sideBarFlag.value = 'fold'
    }
  }
  document.onmouseup = function () {
    document.onmousemove = null;
  };

}

function updateSideBarFlag(type) {
  sideBarFlag.value = type
}

onMounted(() => {
  bus.on('sideBarChange', (type: string) => {
    if (!type) {
      if (sideBarFlag.value == 'hiden') {
        sideBarWidth.value = oldSideBarWidth.value
        sideBarFlag.value = 'expand'
      }
      else type = "hiden"
    }

    if (type == "hiden") {
      if (sideBarFlag.value == 'expand') oldSideBarWidth.value = sideBarWidth.value
      sideBarWidth.value = 0
      sideBarFlag.value = type
    }

    if (type == "fold") {
      if (sideBarFlag.value == 'expand') oldSideBarWidth.value = sideBarWidth.value
      sideBarWidth.value = 64
      sideBarFlag.value = type
    }

    if (type == "expand") {
      sideBarWidth.value = oldSideBarWidth.value
      sideBarFlag.value = type
    }
  })

})

</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-aside {
  height: 100%;
}

.common-layout.home {
  height: 100%;
  background-color: var(--yali-background-color);
  color: var(--yali-text-color);
}

.common-layout.home :deep(.el-main.tool-bar) {
  padding: 0px;
}

:deep(.el-divider) {
  height: 100%;
  width: 0px;
  margin: 0px;
  cursor: ew-resize;
  border-width: 3px;
  user-select: none;
}

:deep(.el-divider):hover {
  border-color: skyblue;
  border-width: 3px;
  user-select: none;
}
</style>
