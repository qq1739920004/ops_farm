# 测试指南 - 处理跨系统 Token 依赖

## 问题背景

本项目的前端应用依赖另一个系统提供 Token 认证，这给自动化测试带来了挑战：
- 单元测试和组件测试无法获取真实 Token
- E2E 测试需要模拟登录流程
- 测试环境可能没有外部系统的访问权限

## 解决方案

我们提供了三套完整的 Mock 方案来解决这个问题。

---

## 一、单元测试 / 组件测试方案

### 核心文件
- `src/utils/request.mock.ts` - Mock HTTP 请求模块
- `src/api/mock/machinery.ts` - 机器相关 API Mock 数据
- `src/api/mock/index.ts` - 通用 Mock 工具和基础数据

### 使用方法

#### 1. 直接在测试中使用 Mock Request

```typescript
import mockRequest, { enableMock, disableMock } from '@/utils/request.mock'

// 启用 Mock
enableMock()

// 发送请求（会被拦截并返回 Mock 数据）
const response = await mockRequest.get('/farm/car/new/list')
console.log(response.data) // { code: 200, data: { list: [...], total: 87 } }
```

#### 2. 在测试 API 模块时 Mock 真实 request

```typescript
import { describe, it, vi } from 'vitest'
import mockRequest from '@/utils/request.mock'

// Mock 真实的 request 模块
vi.mock('@/utils/request', () => ({
  default: mockRequest
}))

// 然后正常导入 API 函数进行测试
import { carNewList_API } from '../machineryList'

describe('机器列表 API', () => {
  it('应返回列表数据', async () => {
    const response = await carNewList_API({ pageNum: 1, pageSize: 10 })
    expect(response.code).toBe(200)
    expect(response.data.list).toBeInstanceOf(Array)
  })
})
```

#### 3. 运行单元测试

```bash
# 运行所有测试
npm run test

# 运行一次（CI 环境使用）
npm run test:run

# 生成覆盖率报告
npm run test:coverage
```

---

## 二、E2E 测试方案（Cypress）

### 核心文件
- `cypress/support/auth.ts` - 认证辅助函数和自定义命令
- `cypress/config/mock-config.ts` - Mock 配置管理
- `cypress/e2e/login-with-mock.cy.ts` - Mock 登录测试示例

### 三种登录方式

#### 方式 1：注入 Mock Token（推荐，最快）

```typescript
describe('测试套件', () => {
  beforeEach(() => {
    // 直接注入 Token，跳过所有登录流程
    cy.mockLogin()
  })

  it('访问受保护页面', () => {
    cy.visit('/#/machineryList')
    // 页面会直接加载，无需登录
    cy.get('.el-table').should('exist')
  })
})
```

**原理**：在 localStorage 中设置 Authorization 和用户信息，应用会认为用户已登录。

#### 方式 2：API 拦截模拟（更接近真实场景）

```typescript
describe('测试套件', () => {
  beforeEach(() => {
    // 设置 API 拦截
    cy.mockAPIs()
  })

  it('通过登录页面进入', () => {
    // 使用 API Mock 方式登录
    cy.apiMockLogin()
    
    // 现在已登录，可以访问其他页面
    cy.visit('/#/machineryList')
    cy.wait('@carList')
  })
})
```

**原理**：拦截 `/auth/oauth/token` 请求，返回 Mock Token 数据。

#### 方式 3：使用真实凭据（需要配置）

```typescript
// cypress.config.ts
export default defineConfig({
  env: {
    // 配置测试账号
    TEST_USERNAME: 'your-test-username',
    TEST_PASSWORD: 'your-test-password',
    // 或者从外部系统获取 Token 的 API
    TOKEN_API_URL: 'https://auth-system.com/api/token'
  }
})
```

然后在测试中使用：

```typescript
Cypress.Commands.add('realLogin', () => {
  // 从外部系统获取 Token
  cy.request('POST', Cypress.env('TOKEN_API_URL'), {
    username: Cypress.env('TEST_USERNAME'),
    password: Cypress.env('TEST_PASSWORD')
  }).then((response) => {
    // 将获取的 Token 注入 localStorage
    window.localStorage.setItem('Authorization', `bearer ${response.body.token}`)
  })
})
```

### 运行 E2E 测试

```bash
# 先启动开发服务器
npm run serve

# 打开 Cypress UI（新窗口）
npm run cypress:open

# 命令行运行所有 E2E 测试
npm run cypress:run

# 指定运行某个测试文件
npx cypress run --spec "cypress/e2e/login-with-mock.cy.ts"
```

### 环境变量配置

你可以通过环境变量控制 Mock 行为：

```bash
# 禁用 Mock（使用真实 API）
npx cypress run --env MOCK_ENABLED=false

# 设置 Mock 延迟
npx cypress run --env MOCK_DELAY=1000

# 启用 Mock 请求日志
npx cypress run --env MOCK_LOG=true
```

---

## 三、Mock 数据自定义

### 1. 添加新的 Mock API

在 `src/utils/request.mock.ts` 中添加路由配置：

```typescript
const mockRoutes = [
  // 已有的路由...
  
  // 添加新的 Mock 路由
  {
    pattern: /\/api\/your-new-endpoint/,
    method: 'GET',
    handler: (params, data, url) => {
      return createMockResponse({
        // 你的 Mock 数据
        items: [{ id: 1, name: 'item1' }],
        total: 100
      })
    }
  }
]
```

### 2. 修改现有 Mock 数据

编辑 `src/api/mock/machinery.ts`：

```typescript
export const machineryMock = {
  carNewList: (params: any) => {
    // 自定义返回数据
    return createMockResponse({
      list: [
        // 你的自定义数据...
      ],
      total: 999
    })
  }
}
```

### 3. 在测试中使用自定义 Mock

```typescript
import mockRequest from '@/utils/request.mock'

// 临时替换某个路由的处理器
describe('自定义测试', () => {
  it('使用自定义 Mock 数据', async () => {
    // 直接调用 request，会被 Mock 拦截
    const response = await mockRequest.post('/farm/car/new/list', {
      pageNum: 1,
      pageSize: 10
    })
    
    // 验证返回的数据结构
    expect(response.data).toHaveProperty('list')
  })
})
```

---

## 四、测试策略建议

### 单元测试 / 组件测试
- ✅ 使用 Mock Request，完全隔离后端依赖
- ✅ 测试组件渲染、交互、事件处理
- ✅ 使用 `vi.mock()` 替换真实依赖

### E2E 测试
- ✅ **开发阶段**：使用 `cy.mockLogin()` 快速测试
- ✅ **集成测试阶段**：使用 `cy.apiMockLogin()` 测试登录流程
- ✅ **生产验证**：使用真实 Token 进行冒烟测试

### 覆盖率要求
```javascript
// vitest.config.ts
coverage: {
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70,
  },
}
```

---

## 五、常见问题

### Q1: Mock 数据不够真实怎么办？
```typescript
// 可以从生产环境导出真实数据作为 Mock
// 保存到 src/api/mock/fixtures/real-data.json
import realData from './fixtures/real-data.json'

handler: () => createMockResponse(realData)
```

### Q2: 某些 API 需要返回特定数据？
```typescript
// 在测试前设置特定的 Mock 响应
beforeEach(() => {
  cy.intercept('GET', '**/api/specific', {
    body: { code: 200, data: { specific: 'value' } }
  }).as('specificApi')
})
```

### Q3: 需要测试错误场景？
```typescript
it('应处理服务器错误', () => {
  cy.intercept('GET', '**/api/machinery/list', {
    statusCode: 500,
    body: { code: 500, message: 'Server Error' }
  }).as('errorApi')
  
  cy.visit('/#/machineryList')
  cy.wait('@errorApi')
  
  // 验证错误提示
  cy.get('.el-message--error').should('be.visible')
})
```

### Q4: 如何测试真实 API？
```bash
# 禁用所有 Mock
MOCK_ENABLED=false npm run cypress:run

# 或者在代码中动态控制
cy.request('GET', '/api/real-endpoint').then((response) => {
  expect(response.status).to.eq(200)
})
```

---

## 六、文件结构

```
ops_farm/
├── src/
│   ├── api/
│   │   ├── mock/
│   │   │   ├── index.ts          # 通用 Mock 工具
│   │   │   └── machinery.ts      # 机器相关 Mock
│   │   └── __tests__/
│   │       └── machinery.test.ts # API 测试示例
│   ├── utils/
│   │   ├── request.mock.ts       # Mock Request 模块
│   │   ├── request.test.ts       # Request 测试
│   │   └── index.test.ts         # 工具函数测试
│   └── store/
│       └── user.test.ts          # Store 测试
├── cypress/
│   ├── config/
│   │   └── mock-config.ts        # Mock 配置
│   ├── e2e/
│   │   ├── login.cy.ts           # 基础登录测试
│   │   ├── login-with-mock.cy.ts # Mock 登录测试
│   │   ├── machineList.cy.ts     # 机器列表测试
│   │   └── navigation.cy.ts      # 导航测试
│   └── support/
│       ├── e2e.ts                # 支持文件
│       ├── commands.ts           # 自定义命令
│       └── auth.ts               # 认证辅助
├── vitest.config.ts              # Vitest 配置
├── cypress.config.ts             # Cypress 配置
└── TESTING_GUIDE.md              # 本指南
```

---

## 快速开始

```bash
# 1. 安装依赖（已完成）
# npm install

# 2. 运行单元测试
npm run test

# 3. 启动服务并运行 E2E 测试
npm run serve
# 新终端：
npm run cypress:open
```

祝测试顺利！如有问题请查看具体测试文件中的注释示例。
