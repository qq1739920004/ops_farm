import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // 排除 Cypress 测试文件
    exclude: [
      'node_modules/',
      'cypress/',
      '**/*.cy.{js,ts}',
      'dist/',
    ],
    // 测试超时设置
    testTimeout: 10000,
    // 钩子超时设置
    hookTimeout: 10000,
    // 启用测试报告
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.d.ts',
        'src/main.ts',
        'src/views/**',
        '**/*.config.*',
        'src/api/mock/**',  // Mock 数据不计入覆盖率
        'src/**/__tests__/**', // 测试文件不计入覆盖率
      ],
    },
    // 环境变量配置
    env: {
      // 标记测试环境
      VITE_TEST_MODE: 'true',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 确保在测试前清除缓存
  esbuild: {
    sourcemap: 'inline',
  },
})
