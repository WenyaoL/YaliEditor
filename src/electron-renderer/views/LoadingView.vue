<template>
    <div class="loading-container">
        <div class="loading-title">Opening..</div>
        <div class="loading"></div>
    </div>
    
</template>

<script setup lang='ts'>
const props = defineProps<{}>()

</script>

<style scoped>
.loading-title{
    position: absolute;
    top: 36%;
    font-size: 31px;
    color: #67C23A;
}
.loading-container{
    width:100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
}
.loading {
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 100%;
  background-color: #409EFF;
  animation: ball-scale infinite linear 0.75s;
}

@keyframes ball-scale {
  0% {
    transform: scale(0.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>