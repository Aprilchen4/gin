<template>
  <warningTip
    title="此功能仅用于创建角色和角色的many2many关系表，具体使用还须自己结合表实现业务，详情参考示例代码（客户示例）。此功能不建议使用，建议使用插件市场【组织管理功能（点击前往）】来管理资源权限。"
    href="https://plugin.gin-vue-admin.com/#/layout/newPluginInfo?id=36"
  />
  <div class="buttonFour">
    <div>
      <el-button type="primary" @click="all">全选</el-button>
      <el-button type="primary" @click="self">本角色</el-button>
      <el-button type="primary" @click="selfAndChildren">
        本角色及子角色
      </el-button>
    </div>
    <el-button type="primary" @click="authDataEnter">确 定</el-button>
  </div>

  <el-checkbox v-model="normalUser" label="普通用户" size="large" />
  <el-checkbox v-model="normalUserChild" label="普通用户子角色" size="large" />
  <el-checkbox v-model="testRole" label="测试角色" size="large" />
</template>
<script setup>
import warningTip from "@/components/WarningTip.vue";
import { ref } from "vue";
import { defineProps, toRefs } from "vue";

// 定义 props
const props = defineProps({
  selectedName: String,
});
// 使用 toRefs 将 props 对象中的 selectedName 属性转换为独立的ref对象
const { selectedName } = toRefs(props);

// 定义响应式变量（替代原来的 data）
const normalUser = ref(false); // 普通用户复选框状态
const normalUserChild = ref(false); // 普通用户子角色复选框状态
const testRole = ref(false); // 测试角色复选框状态

// 定义方法
const all = () => {
  normalUser.value = true;
  normalUserChild.value = true;
  testRole.value = true;
};

const self = () => {
  const roleMap = {
    普通用户: normalUser,
    普通用户子角色: normalUserChild,
    测试角色: testRole,
  };

  // 先全部置为 false
  normalUser.value = false;
  normalUserChild.value = false;
  testRole.value = false;

  // 设置匹配的为 true
  if (roleMap[selectedName.value]) {
    roleMap[selectedName.value].value = true;
  }
};

const selfAndChildren = () => {
  if (selectedName.value === "普通用户") {
    normalUser.value = true;
    normalUserChild.value = true;
    testRole.value = false;
  } else if (selectedName.value === "测试角色") {
    normalUser.value = false;
    normalUserChild.value = false;
    testRole.value = true;
  } else {
    normalUser.value = false;
    normalUserChild.value = true;
    testRole.value = false;
  }
};
</script>

<style>
.buttonFour {
  display: flex;
  justify-content: space-between;
}
</style>
