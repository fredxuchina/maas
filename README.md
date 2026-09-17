# MaaS Hub - 企业级大模型即服务治理与统一网关平台

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue-3.5.x-42b883.svg?style=flat-square&logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.x-3178c6.svg?style=flat-square&logo=typescript)
![Element Plus](https://img.shields.io/badge/Element--Plus-2.14.x-409eff.svg?style=flat-square&logo=elementplus)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8.svg?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-Apache--2.0-green.svg?style=flat-square)

**打通异构大模型壁垒 · 聚合上游多元算力 · 提供标准化 OpenAI 兼容网关与全链路可观测治理**

[功能特性](#-功能特性) • [技术栈](#-技术栈) • [系统架构](#-系统架构) • [快速开始与安装部署](#-快速开始与安装部署) • [感谢与捐赠](#-感谢与捐赠)

</div>

---

## 📖 项目简介

**MaaS Hub（Model-as-a-Service Hub）** 是一套专为企业与组织打造的一站式大模型服务治理与统一网关平台。面向企业内部复杂的 AI 业务接入场景，统一屏蔽异构大模型供应商（OpenAI、Anthropic、DeepSeek、智谱 GLM、通义千问、百度千帆、私有化部署的 vLLM / Ollama 集群等）的接口协议差异，向下纳管海量算力资产，向上提供标准化的安全鉴权、配额限流、多业务线费用分摊与毫秒级全链路调用审计。

---

## ✨ 功能特性

### 1. 🌐 网关全局态势感知大盘 (Dashboard)
- **实时关键指标监控**：毫秒级展现今日请求总量、全网 Token 吞吐量（输入 / 输出精确区分）、平均首字生成时延（TTFT）及总核算费用。
- **服务可用性与健康度**：实时聚合上游各大模型供应商的连通率、状态码分布（200 OK、429 限流、500 异常等）及分流负载占比。
- **动态审计流水**：最新调用日志实时滚动刷新，支持一键下钻链路分析。

### 2. 🔌 异构模型供应商与算力资产管理 (Providers Management)
- **多供应商统一接入**：内置支持 DeepSeek、OpenAI、Anthropic Claude、智谱 BigModel、阿里通义千问、百度文心一言、腾讯混元、月之暗面 Kimi、零一万物、MiniMax 等主流云厂商，以及企业本地自建算力集群（vLLM / Ollama）。
- **模型池编排**：统一配置上游 Base URL、安全密钥、并发上限与权重配比。
- **健康探测机制**：支持主动连通性心跳监测与一键测速，保障高可用故障转移。

### 3. 🔑 标准化网关 API 密钥与安全鉴权 (API Keys & Governance)
- **OpenAI 兼容协议**：下游业务端统一使用 `sk-maas-...` 密钥接入，无需适配各类模型私有 SDK。
- **精细化流控限额**：支持按密钥配置 RPM（每分钟请求数）、TPM（每分钟 Token 数）阈值与月度算力额度。
- **多维度访问控制**：支持限定授权调用的模型白名单、关联归属业务部门、设置有效期以及 IP 白名单校验。
- **多语言接入示例**：内置提供 cURL、Python OpenAI SDK、Node.js、Go 等标准化调用代码片段，开箱即用。

### 4. 📊 细粒度调用监控与全链路审计 (Monitoring & Tracing)
- **全链路参数捕获**：完整记录每次推理的调用者身份、所属部门、目标模型、输入/输出 Token 数、首字延迟（TTFT）、总耗时及单次核算成本。
- **请求内容溯源**：支持查看单次请求的 Prompt 上下文、参数设置（Temperature、Top_P 等）以及模型生成的完整回答，赋能企业安全合规审查。
- **高级筛选过滤**：支持按业务线、模型、状态码及响应延迟进行多条件复合查询与日志导出。

### 5. 💰 算力成本核算与多维费用分摊 (Cost & Billing)
- **精准计费引擎**：基于阶梯式输入 / 输出 Token 单价计算模型消耗，实现千元级以下的小数位精准计费。
- **多维费用分摊**：支持按部门（算法部、电商业务线、智能客服、研发中心等）、按模型、按项目核算成本。
- **预算预警与优化**：直观展示历史消费走势图，自动提供冷门模型降配、提示词工程压缩等算力降本优化建议。

### 6. 🧪 在线模型推理多模沙箱 (Playground)
- **多模型对比调试**：无需编写代码，直观调节 Temperature、Top_P、最大输出 Token、系统提示词（System Prompt）。
- **深度推理推演（CoT）**：完美支持深度思考模型（如 DeepSeek-R1）的思维链（Chain of Thought）折叠推演与实时流式输出渲染。
- **常用提示词预设**：内置代码重构、架构分析、业务摘要等常用 Prompt 库，提升调试效率。

### 7. 👥 用户权限与账号管理 (RBAC & Profile)
- **基于角色的权限控制 (RBAC)**：支持平台超级管理员（Admin）、算法与研发工程师（Developer）、财务与运营主管（Finance）多重角色。
- **账号生命周期管理**：支持用户增删改查、账号冻结/解冻、密码重置、每月算力配额设置。
- **用户头像上传与数据库存储**：
  - 支持通过文件选择或**直接拖拽**本地图片（JPG/PNG/WebP 等）进行上传。
  - 前端 Canvas 智能等比压缩与格式转码，生成轻量 Base64 编码，安全持久化保存至用户数据库。
  - 内置精选预设系统头像库，支持一键切换。
- **快捷身份切换**：支持演示模式下在导航栏右上角一键切换登录身份，快速体验不同角色的权限视图。

---

## 🛠 技术栈

| 层次 / 领域 | 核心技术 / 依赖组件 | 版本 / 备注 |
| :--- | :--- | :--- |
| **前端框架** | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) | `v3.5.x` 核心驱动 |
| **开发与构建** | [Vite](https://vitejs.dev/) | `v6.x` 极速热重载与模块打包 |
| **编程语言** | [TypeScript](https://www.typescriptlang.org/) | `v5.8.x` 全链路强类型约束与接口定义 |
| **UI 组件库** | [Element Plus](https://element-plus.org/) | `v2.14.x` 现代化企业级组件与图标库 |
| **样式解决方案** | [Tailwind CSS](https://tailwindcss.com/) | `v4.x` 现代化原子类工具集 |
| **图表可视化** | [Recharts](https://recharts.org/) / SVG 驱动 | 高性能响应式趋势图与图表分析 |
| **数据持久层** | Local Storage DB Engine / Reactive Store | 封装用户表、审计流水、密钥库与资产数据，持久化存储 |
| **动画效果** | [Motion](https://motion.dev/) | 丝滑的交互反馈与视图切换动画 |

---

## 📁 目录结构

```text
├── index.html                   # HTML 入口文件及 SEO Meta 配置
├── metadata.json                # 项目元数据定义
├── package.json                 # 项目依赖与运行脚本
├── tsconfig.json                # TypeScript 编译选项配置
├── vite.config.ts               # Vite 基础构建与插件配置
├── src/
│   ├── App.vue                  # 顶层布局容器（响应式侧边栏、顶部导航、个人中心）
│   ├── main.ts                  # 应用引导启动入口
│   ├── types.ts                 # 核心业务 TypeScript 接口定义（模型、密钥、日志、用户等）
│   ├── store/
│   │   └── maasStore.ts         # 全局响应式状态机、业务逻辑引擎及数据库持久化层
│   └── components/
│       ├── OverviewView.vue     # 全局网关治理态势感知大盘
│       ├── ProvidersView.vue    # 模型供应商与算力集群资产管理
│       ├── ApiKeysView.vue      # 统一网关 API 密钥与流控管理
│       ├── MonitoringView.vue   # 细粒度调用链路监控与审计
│       ├── CostBillingView.vue  # 算力成本核算与部门费用分摊
│       ├── PlaygroundView.vue   # 在线模型多模态推理调试沙箱
│       ├── UsersView.vue        # 组织用户与 RBAC 权限管理
│       └── LoginView.vue        # 登录认证与演示账号快捷入口
```

---

## 🚀 快速开始与安装部署

### 前置环境需求
- **Node.js**：`v18.0.0` 或更高版本（推荐使用 Node.js `v20+ LTS`）
- **包管理器**：`npm` (v9+)、`yarn` 或 `pnpm`

### 1. 克隆代码到本地
```bash
git clone https://github.com/your-org/maas-hub.git
cd maas-hub
```

### 2. 安装项目依赖
```bash
npm install
# 或者使用 pnpm
pnpm install
```

### 3. 本地启动开发服务器
```bash
npm run dev
```
启动成功后，浏览器访问：
```text
http://localhost:3000
```

### 4. 生产环境打包构建
```bash
npm run build
```
打包产物将输出在 `dist/` 目录中，可直接通过 Nginx、Caddy 或任何静态托管平台进行部署。

### 5. Nginx 生产反向代理配置示例
```nginx
server {
    listen 80;
    server_name maas.yourcompany.com;

    # 前端构建产物静态托管
    location / {
        root /var/www/maas-hub/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 启用 Gzip 压缩提升加载体验
    gzip on;
    gzip_types text/plain application/javascript text/css application/json;
}
```

### 6. Docker 容器化运行部署
编写 `Dockerfile`：
```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
执行构建并启动：
```bash
docker build -t maas-hub:latest .
docker run -d -p 3000:80 --name maas-hub maas-hub:latest
```

---

## 🧪 预设演示账号

系统内置了三组不同角色的预设账号，方便快速体验：

| 角色 | 账号用户名 | 默认密码 | 角色说明与专属权限 |
| :--- | :--- | :--- | :--- |
| **超级管理员** | `admin` | `password123` | 具备平台全部管理权限（供应商配置、全员密钥管理、系统设置） |
| **研发工程师** | `developer` | `password123` | 专注于 API Key 申领、Prompt 联调、沙箱调试与个人调用监控 |
| **财务主管** | `finance` | `password123` | 专注于多部门成本核算、算力费用审计、预算预警与用量报表导出 |

> 💡 **提示**：可以在顶部导航栏右上角点击头像，或在页面内点击「切换身份」，免密直接在不同角色间即时切换。

---

## 💖 感谢与捐赠

如果您觉得 **MaaS Hub** 对您的工作、学习或企业大模型治理落地有所帮助，欢迎为本项目点亮一颗 ⭐ **Star**，您的支持是我们持续迭代和打磨产品体验的最大动力！

### 💬 交流与反馈
- 提交 Bug 反馈与改进建议：请通过 GitHub **Issues** 提交
- 交流与共建想法：欢迎发起 **Pull Request**

### ☕ 捐赠赞助支持 (Sponsorship)
如果您或您的团队希望支持本项目的长期维护与新功能研发，可以通过以下方式赞助作者一杯咖啡 ☕：

| 微信支付 (WeChat Pay) | 支付宝 (Alipay) |
| :---: | :---: |
| 扫码支持开发者 | 扫码支持开发者 |
| ![WeChat QR Placeholder](https://api.iconify.design/lucide:coffee.svg?color=%2310b981&width=120) | ![Alipay QR Placeholder](https://api.iconify.design/lucide:heart-handshake.svg?color=%233b82f6&width=120) |
| *感谢每一位认同与支持开源建设的伙伴！* | *企业赞助请联系项目维护者* |

**致谢名单（鸣谢所有为项目提出建设性意见的贡献者与赞助者）：**
- 感谢开源社区所有提供高质量大模型生态库（Vue、Element Plus、Vite、Tailwind 等）的开发者。
- 感谢在实际生产场景中为网关流控、TTFT 优化及成本精算提出宝贵建议的工程师团队。

---

## 📄 开源许可证

本项目采用 [Apache-2.0](./LICENSE) 协议开源。可免费用于个人学习、学术研究及商业化项目，保留版权说明即可。
