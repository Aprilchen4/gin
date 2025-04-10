<template>
  <!-- 添加 link 属性时，按钮的外观会变成一个链接（通常没有背景和边框），而是只显示文字 -->
  <el-button link type="primary" size="small" @click="onClick">
    <el-icon v-if="icon"><component :is="icon" /></el-icon>
    {{ label }}
  </el-button>
</template>

<script>
export default {
  props: ["icon", "label", "onClick"],
};
</script>
