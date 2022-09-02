<template>
  <el-row class="demo-autocomplete text-center">
    <el-col :span="4" class="optionsText"> 编辑模式 </el-col>
    <el-col :span="4">
      <el-select v-model="editModel" class="m-2" placeholder="Select">
        <el-option
          v-for="item in editModels"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
    </el-col>
  </el-row>
  <el-row class="demo-autocomplete text-center">
    <el-col :span="4" class="optionsText"> sv模式下的代码高亮器 </el-col>
    <el-col :span="4">
      <el-select v-model="codeHightLight" class="m-2" placeholder="Select">
        <el-option
          v-for="item in codeHightLights"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
    </el-col>
  </el-row>
</template>

<script  lang="ts" setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const editModel = ref(store.state.editModel);
const codeHightLight = ref('')
const editModels = [
    {value: "ir",},
    {value: "sv",},
];
const codeHightLights = [
    {value: "vscode2015",},
    {value: "sv",},
]
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