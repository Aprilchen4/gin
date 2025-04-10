<template>
  <div class="bottomline">
    <div style="margin-right: 3px">Powered by</div>
    <a href="https://github.com/flipped-aurora/gin-vue-admin" class="bottom-a">Gin-Vue-Admin</a>
    <div style="margin-left: 3px">Copyright</div>
    <a href="https://github.com/flipped-aurora" class="bottom-a">flipped-aurora 团队</a>
  </div>
</template>
<style>
.picture-line {
  height: 100vh; /* 高度填满 */
  width: auto; /* 宽度自适应 */
  min-width: 100px; /* 最小宽度防止过小 */
  object-fit: cover;
  flex-shrink: 1; /* 允许缩放 */
}

.picture {
  width: 60%;
  height: 100vh;
  object-fit: cover;
}

.picture-fill {
  width: 20%;
  height: 100vh;
  object-fit: cover;
  /* flex-shrink: 0; 禁止缩放 */
}

.bottomline {
  /* 移除所有定位属性（position/left等），仅用普通文档流 */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  background-color: transparent;
  color: var(--text-color);
  /* 使用主题变量 */
  font-size: 14px;
  font-family: "Microsoft YaHei", sans-serif;
  /* 相对定位在el-main下方 ，这里必须是相对,相对定位的元素仍会跟随文档流移动，会随控制台移动*/
  /* position: relative;
  margin-top: 10px;
  left: 0; */

  /* 暗黑模式适配 */
  [data-theme="dark"] & {
    color: #e0e0e0;
  }
}

.bottom-a {
  color: #0059ff;
  font-weight: bold;
  text-decoration: none;
  margin: 0 3px;
  transition: color 0.3s;

  .bottom-a:hover {
    color: #000cb6;
  }

  /* 暗黑模式适配 */
  [data-theme="dark"] & {
    color: #4a9cff;

    &:hover {
      color: #7ab6ff;
    }
  }
}
/* 底部图标格式 */
.icon-link {
  margin: 0 2px;
  font-size: 27px;
  /* color: #150202; 这里无法改变icon颜色*/
}

/* .bottom 元素下的所有直接子元素，设置上下边距为 0,左右边距为 10 像素 */
.bottom > * {
  margin: 0 10px;
}
</style>
