<script setup>
import { ref } from "vue";

const input = ref("");
</script>

<template>
  <div>
    <el-input v-model="input" style="width: 240px" placeholder="Please input" />
    <p>输入内容：{{ input }}</p>
  </div>
</template>
