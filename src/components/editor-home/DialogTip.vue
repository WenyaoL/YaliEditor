<template>
  <div>
    <!-- Table -->
    <el-button id="dialog-form-button" v-show="displayButton" text @click="dialogFormVisible = true"
      >table create</el-button
    >
    <!-- author details -->
    <el-button id="dialog-author-details-button" v-show="displayButton" text @click="dialogDetailsVisible = true"
      >author details</el-button
    >

    <el-dialog v-model="dialogFormVisible" title="创建表格" :width="'35%'">
        <el-form :model="form" :label-width="60" style="max-width: 300px">
        <el-form-item label="行">
            <el-input v-model.number="form.row" />
        </el-form-item>
        <el-form-item label="列">
            <el-input v-model.number="form.col" />
        </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">Cancel</el-button>
            <el-button type="primary" @click="createTable()">Confirm</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogDetailsVisible" title="关于作者" :width="'50%'">
      <div class="dia-image">
        <el-image style="width: 100px; height: 100px;" :src="imgPath" :fit="'fill'" />
      </div>
      <p class="author-det">
        <strong>Github地址:</strong>
        <a @click="aClick($event)" href="https://github.com/WenyaoL/YaliEditor">https://github.com/WenyaoL/YaliEditor（￣︶￣）↗　</a>
        <br>
        <strong>作者:</strong>
        yalier(💊)
      </p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDetailsVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import YaLiEditor from '@/YaliEditor/src'

import { reactive, ref } from 'vue'
import {useStore} from 'vuex'
const props = defineProps({
  displayButton: Boolean
})
const dialogFormVisible = ref(false)
const dialogDetailsVisible = ref(false)
const form = reactive({
  row: 3,
  col: 3,
})
const store = useStore()
//生成环境路径
const imgPath = "app://./yali.png"

//const imgPath = "public/yali.png"
const aClick = (event:MouseEvent&{target:HTMLElement})=>{
  store.dispatch('openURL',event.target.getAttribute("href"))

  event.preventDefault()
}

const createTable = ()=>{

  if(store.state.editorModule.editModel == "IR"){
    let yali:YaLiEditor = store.state.editorModule.yaliEditor
    yali.ir.hotkeyProcessor.tableCreate(form.row,form.col)
  }
  
  
  dialogFormVisible.value = false
}

</script>

<style lang="scss" scope>

.el-dialog .el-dialog__header{
  text-align: left;
}

.dia-image{
  text-align: center;
}

.author-det{
  line-height: 200%;
  a{
    color: #4183C4;
    cursor: pointer;
  }
}
</style>