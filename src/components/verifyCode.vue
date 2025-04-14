<template>
  <div class="verify-code">
    <div @click="refreshCode">{{ code }}</div>
    <!-- <span>: 这是一个 HTML 标签,用来包裹一段文本内容,
        {{ code }}: 这是 Vue.js 的插值语法, -->
    <!-- <button @click="refreshCode">刷新</button> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
// 生成随机验证码（纯数字）
const generateCode = () => {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// 使用 ref 创建响应式验证码
const code = ref(generateCode());

// 刷新验证码方法
const refreshCode = () => {
  code.value = generateCode();
};
</script>

<style scoped>
.verify-code {
  display: flex;
  align-items: center;
  margin: 3px;
  /*距离上边缘的高度 */
  margin-left: 20px;
  width: 70px;
  font-size: 20px;
  height: 80%;
  background-color: rgb(188, 188, 181);
}
</style>
