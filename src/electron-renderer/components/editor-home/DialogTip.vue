<template>
  <div>
    <!-- Table -->
    <el-button id="dialog-form-button" v-show="displayButton" text @click="dialogCreateTableVisible = true"
      >table create</el-button
    >
    <!-- author details -->
    <el-button id="dialog-author-details-button" v-show="displayButton" text @click="dialogDetailsVisible = true"
      >author details</el-button
    >

    <el-dialog v-model="dialogCreateTableVisible" title="Create Table" :width="'35%'">
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
            <el-button @click="dialogCreateTableVisible = false">Cancel</el-button>
            <el-button type="primary" @click="createTable()">Confirm</el-button>
        </span>
        </template>
    </el-dialog>

    <el-dialog v-model="dialogDetailsVisible" title="about author" :width="'50%'">
      <div class="dia-image">
        <el-image style="width: 100px; height: 100px;" :src="imgPath" :fit="'fill'" />
      </div>
      <p class="author-det">
        <strong>Github address:</strong>
        <a @click="linkClick" href="https://github.com/WenyaoL/YaliEditor">https://github.com/WenyaoL/YaliEditor（￣︶￣）↗　</a>
        <br>
        <strong>author:</strong>
        yalier(💊)
      </p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDetailsVisible = false">Close</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogErrorMessageVisible" title="errorMessage" :width="'50%'">
      <div class="errorMessage"><el-icon><WarningFilled /></el-icon>{{ errorMessage }}</div>
      <div class="infoMessage"><el-icon><InfoFilled /></el-icon>Temporary file has been generated.(on save path)</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogErrorMessageVisible = false">Close</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import {WarningFilled, InfoFilled} from '@element-plus/icons-vue'
import YaLiEditor from '../../YaliEditor/src'
import bus from '../../bus'
import { reactive, ref } from 'vue'
import {useStore} from 'vuex'
const props = defineProps({
  displayButton: Boolean
})
const store = useStore()
const dialogCreateTableVisible = ref(false)
const dialogDetailsVisible = ref(false)
const dialogErrorMessageVisible = ref(false)
const form = reactive({
  row: 3,
  col: 3,
})

const errorMessage = ref('')

//生成环境路径
const imgPath = "app://./yali.png"

//const imgPath = "public/yali.png"
const linkClick = (event:MouseEvent&{target:HTMLElement})=>{
  store.dispatch('openURL',event.target.getAttribute("href"))
  event.preventDefault()
}

const createTable = ()=>{
  if(store.state.editorModule.editModel == "IR"){
    let yali:YaLiEditor = store.state.editorModule.yaliEditor
    yali.ir.hotkeyProcessor.tableCreate(form.row,form.col)
  }
  dialogCreateTableVisible.value = false
}


//bus functions
bus.on('dialog:errorMessage',(message:string)=>{
  errorMessage.value = message
  dialogErrorMessageVisible.value = true
})

bus.on('dialog:createTable',(row:number=3,col:number=3)=>{
  form.row = row
  form.col = col
  dialogCreateTableVisible.value = true
})

bus.on('dialog:authorDetails',()=>{
  dialogDetailsVisible.value = true
})

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

.errorMessage{
  color: #ff2448;
}
</style>