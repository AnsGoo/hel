<script setup lang="ts">
import { ref } from 'vue';
import { Button } from 'ant-design-vue';

const count = ref(0);

const add = () => {
  count.value = count.value + 1;
};
defineExpose({
  count,
});
</script>

<template>
  <div class="wrapper">
    <span class="card">Remote2</span>
    <Button @click="add">count is {{ count }}</Button>
  </div>
</template>

<style scoped>
.card {
  color: blue;
}
</style>
