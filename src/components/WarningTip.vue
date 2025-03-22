<template>
  <div class="warning-tip" :class="href && 'cursor-pointer'" @click="open">
    <el-icon :size="13">
      <warning-filled />
    </el-icon>
    <span>
      {{ title }}
    </span>
  </div>
</template>

<script setup>
import { WarningFilled } from "@element-plus/icons-vue";
import { defineProps } from "vue";
const prop = defineProps({
  title: {
    type: String,
    default: "",
  },
  href: {
    type: String,
    default: "",
  },
});

const open = () => {
  if (prop.href) {
    window.open(prop.href);
  }
};
</script>

<style scoped>
.warning-tip {
  padding: 15px;
  background-color: #fff3cd; /* 浅黄色背景 */
  border: 1px solid #ffeeba; /* 边框颜色 */
  border-radius: 4px;
  color: #cc9c0a; /* 文字颜色 */
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: x-small;
}

.warning-tip a {
  color: #004085; /* 链接颜色 */
  text-decoration: underline;
}

.warning-tip a:hover {
  color: #002752; /* 链接悬停颜色 */
}
</style>
