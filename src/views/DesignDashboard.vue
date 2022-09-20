<template>
<el-form :model="seting" 
          label-width="auto"
          label-position="top">

  <el-form-item label="编辑模式">
      <el-select v-model="seting.editModel" class="m-2" placeholder="Select" @change="editModelChange">
        <el-option
          v-for="item in editModels"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
  </el-form-item>

  <!--<el-form-item label="SV模式下的代码高亮器">
      <el-select v-model="seting.codeHightLight" class="m-2" placeholder="Select" @change="editModelChange">
        <el-option
          v-for="item in codeHightLights"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
  </el-form-item>-->

</el-form>

</template>

<script  lang="ts" setup>
import { onMounted, ref, reactive} from "vue";
import { useStore } from "vuex";
const store = useStore();

const seting = reactive({
  editModel:store.state.editModel,
  codeHightLight:''
})


const editModel = ref(store.state.editModel);
const codeHightLight = ref('')
const editModels = [
    {value: "IR",},
    {value: "SV",},
    {value: "ONLY",},
];
const codeHightLights = [
    {value: "vscode2015",},
    {value: "sv",},
]

function editModelChange(val){
  store.commit("updateEditModel",val)
}


</script>

<style>
.optionsText {
  line-height: 200%;
  /*padding-top: 3px;*/
  font-size: medium;
  font-weight: bold;
}
.el-row {
  margin-bottom: 20px;
}
</style>