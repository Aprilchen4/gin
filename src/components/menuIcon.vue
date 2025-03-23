<template>
  <div>
    <el-select
      v-model="key"
      placeholder="请选择"
      style="width: 200px; font-style: normal"
    >
      <el-option
        v-for="item in options"
        :key="item.key"
        :label="item.label"
        :value="item.key"
      />
    </el-select>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const options = reactive([
  {
    key: "aim",
    label: "aim",
  },
  {
    key: "add-location",
    label: "add-location",
  },
  {
    key: "apple",
    label: "apple",
  },
  {
    key: "alarm-clock",
    label: "alarm-clock",
  },
  {
    key: "arrow-down",
    label: "arrow-down",
  },
  {
    key: "arrow-down-bold",
    label: "arrow-down-bold",
  },
  {
    key: "arrow-left",
    label: "arrow-left",
  },
  {
    key: "arrow-left-bold",
    label: "arrow-left-bold",
  },
  {
    key: "arrow-right-bold",
    label: "arrow-right-bold",
  },
  {
    key: "arrow-up",
    label: "arrow-up",
  },
  {
    key: "back",
    label: "back",
  },
  {
    key: "bell",
    label: "bell",
  },
]);
</script>
