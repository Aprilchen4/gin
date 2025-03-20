<template>
  <div>
    <el-checkbox-group>
      <!-- 使用 el-collapse 包裹树状数据 -->
      <el-collapse v-model="activeNames">
        <!-- 遍历树状数据 -->
        <div
          v-for="treeData in treeDatas"
          :key="treeData.menuId"
          class="checkbox-item"
        >
          <!-- 有子项目的节点：使用 el-collapse-item -->
          <el-collapse-item
            v-if="treeData.children && treeData.children.length"
            :name="treeData.menuId"
          >
            <!-- 父级 checkbox 和自定义折叠图标 -->
            <template #title>
              <div class="parent-item">
                <!-- 自定义折叠图标 -->
                <span
                  class="toggle-icon"
                  :class="{
                    'is-expanded': activeNames.includes(treeData.menuId),
                  }"
                >
                  ▶
                </span>
                <!-- 父级 checkbox -->
                <el-checkbox :label="treeData.meta.title">
                  {{ treeData.meta.title }}
                  <el-button
                    link
                    type="success"
                    size="small"
                    @click="handleClickFirst"
                  >
                    设为首页
                  </el-button>
                </el-checkbox>
              </div>
            </template>

            <!-- 子项目 -->
            <div class="nested">
              <checkboxTree :treeDatas="treeData.children" />
            </div>
          </el-collapse-item>

          <!-- 没有子项目的节点：直接渲染 checkbox -->
          <el-checkbox v-else :label="treeData.meta.title">
            {{ treeData.meta.title }}
            <el-button
              link
              type="success"
              size="small"
              @click="handleClickFirst"
            >
              设为首页
            </el-button>
          </el-checkbox>
        </div>
      </el-collapse>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";

// 定义 props
defineProps({
  treeDatas: {
    type: Array,
    required: true,
  },
  selectedItems: {
    type: Array,
    required: true,
  },
});

// 控制折叠面板的展开项
const activeNames = ref([]);
</script>

<style scoped>
.checkbox-item {
  margin-bottom: 8px;
}

.parent-item {
  display: flex;
  align-items: center;
}

/* 隐藏默认的折叠箭头 */
:deep(.el-collapse-item__header) .el-icon {
  display: none;
}

/* 自定义折叠图标 */
.toggle-icon {
  margin-right: 8px;
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.2s;
}

/* 展开时旋转为向下 */
.toggle-icon.is-expanded {
  transform: rotate(90deg);
}

.nested {
  margin-left: 20px; /* 子级缩进 */
}
</style>
