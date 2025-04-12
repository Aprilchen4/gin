<template>
  <div class="warning-tip" :class="href && 'cursor-pointer'" @click="open">
    <el-icon :size="13">
      <warning-filled />
    </el-icon>
    <span class="warning-title">
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
  height: 40px;
  padding: 5 0 5px;
  /* background-color: #fdf6dc; 浅黄色背景*/
  background: var(--warning-bg);
  border-radius: 4px;
  color: #f1b607; /* 文字颜色 */
  margin: 10 0 5 0px;
  display: flex;
  align-items: center;
  font-size: small;
}

.warning-title {
  line-height: 80%; /* 让字体在垂直方向占 60% */
  flex-grow: 1; /* 使标题占用剩余空间 */
  margin-left: 3px;
}

.warning-tip a {
  color: #004085; /* 链接颜色 */
  text-decoration: underline;
}

.warning-tip a:hover {
  color: #002752; /* 链接悬停颜色 */
}
</style>
