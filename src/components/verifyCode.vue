<template>
    <div class="verify-code">
      <span @click="refreshCode">{{ code }}</span>
      <!-- <span>: 这是一个 HTML 标签,用来包裹一段文本内容,
        {{ code }}: 这是 Vue.js 的插值语法, -->
      <!-- <button @click="refreshCode">刷新</button> -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        code: this.generateCode(), // 初始验证码
      };
    },
    
    methods: {
      // 生成随机验证码（字母和数字组合）
      generateCode() {
        // const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const chars ='0123456789'
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      },
      // 刷新验证码
      refreshCode() {
        this.code = this.generateCode();
      },
    },
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