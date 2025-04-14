<template>
  <!-- 想象这是一个“图片展示柜”，里面放着三种展示工具：
picType === 'avatar'：用一个圆形的小框（<el-avatar>）展示头像，大小固定为 30 像素。如果有图片就用 avatar，没有就用 noAvatar（默认图片）。
picType === 'img'：用普通的 <img> 标签展示图片，也弄成圆形（通过 CSS），大小是 30x30。如果有图片用 avatar，没有就用 noAvatar。
picType === 'file'：用一个高级图片工具（<el-image>），可以放大预览（通过 previewSrcList），大小是 80x80。如果有图片用 file，没有就用 noAvatar。
这个 <span class="headerAvatar"> 就像柜子的外壳，把图片居中摆好。 -->

  <!-- 根据 picType（外部传来的指示）决定用哪种工具展示图片。
每种工具都有一个“优先图片”（avatar 或 file）和一个“备胎图片”（noAvatar），用 || 表示“如果前面没货，就用后面的”。 -->
  <span class="headerAvatar">
    <template v-if="picType === 'avatar'">
      <el-avatar :size="30" :src="avatar || noAvatar" />
    </template>
    <template v-if="picType === 'img'">
      <img :src="avatar || noAvatar" class="avatar" />
    </template>
    <template v-if="picType === 'file'">
      <el-image :src="file || noAvatar" class="file" :preview-src-list="previewSrcList" :preview-teleported="true" />
    </template>
  </span>
</template>

<script setup>
import noAvatarPng from "@/assets/noBody.png";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { defineOptions, defineProps } from "vue";

const path = ref(process.env.VUE_APP_BASE_API + "/"); // 服务器地址前缀，比如 http://api.example.com/
const noAvatar = ref(noAvatarPng); // 默认图片的路径
const userStore = useStore(); // 获取 Vuex 的用户数据

defineOptions({
  name: "customPic", //组件名叫 customPic
});

const props = defineProps({
  picType: { type: String, required: false, default: "avatar" }, // 显示类型，默认是 avatar
  picSrc: { type: String, required: false, default: "" }, // 外部传来的图片地址，默认空
  preview: { type: Boolean, default: false }, // 是否支持预览，默认不支持
});

// 计算头像图片地址
const avatar = computed(() => {
  // 优先使用 props.picSrc
  const src = props.picSrc || ""; // 先看外部传来的 picSrc，没有就空字符串
  // 如果有外部图片
  if (src) {
    return src.startsWith("http") ? src : path.value + src; // 如果是完整 URL 就直接用，不是就加上服务器前缀
  }
  // 没有外部图片，就用用户自己的头像
  const userInfo = userStore.userInfo || {}; // 用户信息，可能为空
  const userHeaderImg = userInfo.headerImg || ""; // 用户头像，可能为空
  return userHeaderImg.startsWith("http") ? userHeaderImg : path.value + userHeaderImg;
});

// 计算文件图片地址
const file = computed(() => {
  const src = props.picSrc || ""; // 外部图片
  return src && !src.startsWith("http") ? path.value + src : src; // 有图片且不是完整 URL 就加前缀，否则直接用
});

// 计算预览列表
const previewSrcList = computed(() => (props.preview && file.value ? [file.value] : []));
</script>

<style scoped>
.headerAvatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
}
.file {
  width: 80px;
  height: 80px;
  position: relative;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
