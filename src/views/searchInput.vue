<template>
    <div>
      <el-input v-model="inputValue" placeholder="请输入你需要快捷到达的功能"></el-input>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const inputValue = ref('')

  </script>