<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'ant-design-vue';

const count = ref(0);

const add = () => {
  count.value = count.value + 1;
};
</script>

<template>
  <div class="wrapper">
    <span class="card">这是远程组件1</span>
    <Button @click="add">count is {{ count }}</Button>
  </div>
</template>

<style scoped>
.card {
  color: blue;
}
</style>
