module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.vue$': '@vue/vue3-jest',
      '^.+\\.js$': 'babel-jest',
      '^.+\\.(css|scss|sass|less|styl|png|jpg|jpeg|gif|svg)$': 'jest-transform-stub'
    },
    moduleFileExtensions: ['js', 'vue', 'json'],
    extensionsToTreatAsEsm: ['.vue'], // 强制将 .vue 和 .js 文件视为 ESM
    moduleNameMapper: {
      '^vue$': 'vue',
      '^@/(.*)$': '<rootDir>/src/$1' // 支持 @ 别名
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], // 测试前置脚本
    testMatch: ['**/tests/**/*.spec.js'], // 匹配测试文件
    preset: '@vue/cli-plugin-unit-jest'
  };