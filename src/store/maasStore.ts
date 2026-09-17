import { reactive, computed, ref } from 'vue';
import type { Provider, ApiKeyConfig, InvocationLog, User, MySQLTable, SqlQueryResult, JavaSourceFile } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-001',
    username: 'admin',
    password: 'password123',
    name: '系统总架构师',
    email: 'admin@maas-enterprise.com',
    phone: '13800138001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80',
    role: 'admin',
    roleLabel: '超级平台管理员',
    department: '平台架构部',
    organization: '企业AI算力调度中心',
    status: 'active',
    monthlyQuotaCny: 50000,
    lastLoginAt: '2026-03-16 22:30:12',
    createdAt: '2026-01-01 00:00:00',
  },
  {
    id: 'usr-002',
    username: 'developer',
    password: 'password123',
    name: '智能算法工程师',
    email: 'algo@maas-enterprise.com',
    phone: '13911223344',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80',
    role: 'developer',
    roleLabel: '算法架构师',
    department: '算法研发中心',
    organization: '企业AI算力调度中心',
    status: 'active',
    monthlyQuotaCny: 15000,
    lastLoginAt: '2026-03-16 21:15:45',
    createdAt: '2026-01-05 10:00:00',
  },
  {
    id: 'usr-003',
    username: 'finance',
    password: 'password123',
    name: '财务精算审计总监',
    email: 'finance@maas-enterprise.com',
    phone: '13799887766',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80',
    role: 'finance',
    roleLabel: '财务审计总监',
    department: '财务管理部',
    organization: '企业AI算力调度中心',
    status: 'active',
    monthlyQuotaCny: 10000,
    lastLoginAt: '2026-03-16 19:40:20',
    createdAt: '2026-02-01 08:30:00',
  },
  {
    id: 'usr-004',
    username: 'cs_lead',
    password: 'password123',
    name: '客户服务运维专家',
    email: 'service@maas-enterprise.com',
    phone: '13612345678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop&q=80',
    role: 'developer',
    roleLabel: '运维开发工程师',
    department: '客户服务中心',
    organization: '企业AI算力调度中心',
    status: 'active',
    monthlyQuotaCny: 8000,
    lastLoginAt: '2026-03-15 14:22:10',
    createdAt: '2026-02-10 11:00:00',
  },
  {
    id: 'usr-005',
    username: 'guest_test',
    password: 'password123',
    name: '外部联合实验室观察员',
    email: 'guest@partner-ai.org',
    phone: '13587654321',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop&q=80',
    role: 'developer',
    roleLabel: '沙箱测试员',
    department: 'AI 创新实验室',
    organization: '企业AI算力调度中心',
    status: 'disabled',
    monthlyQuotaCny: 1000,
    lastLoginAt: '2026-03-10 09:00:00',
    createdAt: '2026-03-01 09:30:00',
  },
];

export const currentUser = reactive<User>({
  ...initialUsers[0],
});

export const initialProviders: Provider[] = [
  {
    id: 'prov-deepseek',
    name: 'DeepSeek (深度求索)',
    code: 'deepseek',
    logoUrl: 'https://api.iconify.design/simple-icons:deepin.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: 'sk-dpsk-enc-789a6b5c4d3e2f10',
    status: 'active',
    latencyMs: 260,
    errorRate: 0.0012,
    weight: 100,
    isCustom: false,
    description: '国内顶尖国产开源大模型，深度推理 R1 与 通用模型 V3，高性价比与超强逻辑推理能力',
    createdAt: '2026-01-05 10:00:00',
    updatedAt: '2026-03-12 15:40:00',
    models: [
      {
        id: 'deepseek-r1',
        name: 'deepseek-reasoner',
        displayName: 'DeepSeek-R1 (深度推理大模型)',
        providerId: 'prov-deepseek',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 4.0, completionPerMillion: 16.0 },
        enabled: true,
        category: 'reasoning',
        description: '强化学习大模型，思维链推理深度强悍，复杂数学代码能力卓越',
      },
      {
        id: 'deepseek-v3',
        name: 'deepseek-chat',
        displayName: 'DeepSeek-V3 (通用旗舰大模型)',
        providerId: 'prov-deepseek',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 1.0, completionPerMillion: 2.0 },
        enabled: true,
        category: 'chat',
        description: '671B MoE 架构，全面对齐闭源顶级模型，高吞吐低延迟普惠之选',
      },
    ],
  },
  {
    id: 'prov-openai',
    name: 'OpenAI (公有云通道)',
    code: 'openai',
    logoUrl: 'https://api.iconify.design/simple-icons:openai.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-oai-enc-992388102a9bcefa',
    status: 'active',
    latencyMs: 480,
    errorRate: 0.0035,
    weight: 90,
    isCustom: false,
    description: '业界基准 GPT-4o 及 o1 慢思考系列，具备超高通用性与成熟生态支持',
    createdAt: '2026-01-01 08:30:00',
    updatedAt: '2026-03-10 11:20:00',
    models: [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        displayName: 'GPT-4o (Omni 原生多模态)',
        providerId: 'prov-openai',
        contextWindow: 128000,
        maxOutputTokens: 16384,
        pricing: { promptPerMillion: 18.0, completionPerMillion: 72.0 },
        enabled: true,
        category: 'vision',
        description: '原生图文音综合旗舰，图表识别与结构化输出极其精准',
      },
      {
        id: 'o1-preview',
        name: 'o1-preview',
        displayName: 'OpenAI o1 (科研慢思考模型)',
        providerId: 'prov-openai',
        contextWindow: 128000,
        maxOutputTokens: 32768,
        pricing: { promptPerMillion: 108.0, completionPerMillion: 432.0 },
        enabled: true,
        category: 'reasoning',
        description: '专用于复杂算法推演、高维数学证明与高壁垒架构决策',
      },
    ],
  },
  {
    id: 'prov-anthropic',
    name: 'Anthropic Claude',
    code: 'anthropic',
    logoUrl: 'https://api.iconify.design/simple-icons:anthropic.svg',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: 'sk-ant-enc-5566778899aabbcc',
    status: 'active',
    latencyMs: 520,
    errorRate: 0.0020,
    weight: 85,
    isCustom: false,
    description: 'Claude 3.5 Sonnet 系列，200K超长文本架构解析与卓越的编程综合能力',
    createdAt: '2026-01-03 14:00:00',
    updatedAt: '2026-03-11 18:00:00',
    models: [
      {
        id: 'claude-3-5-sonnet',
        name: 'claude-3-5-sonnet-20241022',
        displayName: 'Claude 3.5 Sonnet (代码王牌)',
        providerId: 'prov-anthropic',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 21.6, completionPerMillion: 108.0 },
        enabled: true,
        category: 'code',
        description: '代码重构、全栈开发及长篇技术规范阅读的顶尖标杆',
      },
    ],
  },
  {
    id: 'prov-qwen',
    name: '通义千问 (Qwen-Max)',
    code: 'qwen',
    logoUrl: 'https://api.iconify.design/simple-icons:alibabadotcom.svg',
    protocol: 'openai-compatible',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-qwen-enc-33441122aabb',
    status: 'active',
    latencyMs: 190,
    errorRate: 0.0008,
    weight: 95,
    isCustom: false,
    description: '阿里云全模态旗舰基座，中文语境和政企应用支持深厚，响应迅捷稳定',
    createdAt: '2026-01-08 09:00:00',
    updatedAt: '2026-03-09 16:15:00',
    models: [
      {
        id: 'qwen-max',
        name: 'qwen-max',
        displayName: 'Qwen-Max (通义超大规模版)',
        providerId: 'prov-qwen',
        contextWindow: 32768,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 20.0, completionPerMillion: 60.0 },
        enabled: true,
        category: 'chat',
        description: '政企公文书写、国内垂直领域知识 RAG 检索增强',
      },
    ],
  },
  {
    id: 'prov-ollama',
    name: '私有算力集群 (Ollama K8s)',
    code: 'ollama',
    logoUrl: 'https://api.iconify.design/simple-icons:ollama.svg',
    protocol: 'ollama',
    baseUrl: 'http://10.200.88.10:11434/v1',
    apiKey: 'ollama-internal-bearer-token',
    status: 'active',
    latencyMs: 65,
    errorRate: 0.0,
    weight: 100,
    isCustom: true,
    description: '内网专用 8×H800 GPU 集群，承载内部高敏感数据与离线微调模型',
    createdAt: '2026-01-15 11:30:00',
    updatedAt: '2026-03-12 17:00:00',
    models: [
      {
        id: 'llama3-70b-local',
        name: 'llama3:70b-instruct',
        displayName: 'Llama 3 70B (本地高性能版)',
        providerId: 'prov-ollama',
        contextWindow: 8192,
        maxOutputTokens: 4096,
        pricing: { promptPerMillion: 0.0, completionPerMillion: 0.0 },
        enabled: true,
        category: 'chat',
        description: '零公网流量、完全数据隐私合规的本地自建部署',
      },
    ],
  },
];

export const initialApiKeys: ApiKeyConfig[] = [
  {
    id: 'key-01',
    name: '智能客服工单助手 (客服 Agent)',
    keyPrefix: 'maas-sk-live-01',
    fullKey: 'maas-sk-live-0198f7e2a9b3c4d5e6f7a8b9c0d1e2f3',
    userId: 'usr-001',
    userName: '张主管 (客服运营)',
    department: '客户服务中心',
    status: 'active',
    allowedModels: ['*'],
    rateLimitRpm: 1200,
    rateLimitTpm: 800000,
    monthlyQuotaCny: 10000,
    usedQuotaCny: 3240.65,
    totalCalls: 48290,
    createdAt: '2026-01-10 09:00:00',
    lastUsedAt: '2026-03-16 22:15:30',
    ipWhitelist: ['10.10.2.*', '192.168.1.100'],
  },
  {
    id: 'key-02',
    name: '智能代码审查与研发 Copilot',
    keyPrefix: 'maas-sk-live-02',
    fullKey: 'maas-sk-live-02a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    userId: 'usr-002',
    userName: '李架构 (基础研发)',
    department: '软件研发中心',
    status: 'active',
    allowedModels: ['deepseek-r1', 'claude-3-5-sonnet', 'deepseek-v3'],
    rateLimitRpm: 1800,
    rateLimitTpm: 1200000,
    monthlyQuotaCny: 15000,
    usedQuotaCny: 8912.4,
    totalCalls: 124500,
    createdAt: '2026-01-15 14:30:00',
    lastUsedAt: '2026-03-16 22:28:10',
    ipWhitelist: ['*'],
  },
  {
    id: 'key-03',
    name: '企业财务报表智能归因系统',
    keyPrefix: 'maas-sk-live-03',
    fullKey: 'maas-sk-live-03c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
    userId: 'usr-003',
    userName: '王总监 (财务审计)',
    department: '财务管理部',
    status: 'active',
    allowedModels: ['deepseek-r1', 'gpt-4o'],
    rateLimitRpm: 300,
    rateLimitTpm: 200000,
    monthlyQuotaCny: 5000,
    usedQuotaCny: 820.15,
    totalCalls: 6800,
    createdAt: '2026-02-01 10:00:00',
    lastUsedAt: '2026-03-16 20:05:12',
    ipWhitelist: ['10.50.12.0/24'],
  },
  {
    id: 'key-04',
    name: '知识图谱与内部 Wiki RAG',
    keyPrefix: 'maas-sk-live-04',
    fullKey: 'maas-sk-live-04e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    userId: 'usr-001',
    userName: '系统总架构师',
    department: '架构技术委员会',
    status: 'active',
    allowedModels: ['*'],
    rateLimitRpm: 600,
    rateLimitTpm: 500000,
    monthlyQuotaCny: 8000,
    usedQuotaCny: 1560.8,
    totalCalls: 23410,
    createdAt: '2026-02-12 11:20:00',
    lastUsedAt: '2026-03-16 21:50:00',
    ipWhitelist: ['*'],
  },
  {
    id: 'key-05',
    name: '算法预研与模型压测测试沙箱',
    keyPrefix: 'maas-sk-test-01',
    fullKey: 'maas-sk-test-01f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5',
    userId: 'usr-002',
    userName: '李架构 (基础研发)',
    department: 'AI 创新实验室',
    status: 'active',
    allowedModels: ['*'],
    rateLimitRpm: 60,
    rateLimitTpm: 50000,
    monthlyQuotaCny: 500,
    usedQuotaCny: 88.5,
    totalCalls: 1240,
    createdAt: '2026-03-01 16:00:00',
    lastUsedAt: '2026-03-16 19:10:00',
    ipWhitelist: ['*'],
  },
];

export const initialLogs: InvocationLog[] = [
  {
    id: 'tr-20260316-9901',
    timestamp: '2026-03-16 22:28:10',
    apiKeyId: 'key-02',
    apiKeyName: '智能代码审查与研发 Copilot',
    userId: 'usr-002',
    userName: '李架构 (基础研发)',
    providerId: 'prov-deepseek',
    providerName: 'DeepSeek (深度求索)',
    modelId: 'deepseek-r1',
    modelName: 'DeepSeek-R1 (深度推理)',
    promptTokens: 1840,
    completionTokens: 2450,
    totalTokens: 4290,
    promptSnippet: '帮我审查基于 Java Spring Boot 3 的多线程网关分发逻辑，分析是否存在内存泄漏风险与锁竞争...',
    responseSnippet: '<think>首先分析该代码段使用的 ConcurrentHashMap 与线程池策略。发现其没有限定队列长度，在高并发情况下可能导致 OOM。建议使用有界 BlockingQueue，并结合熔断降级机制...</think>审查意见如下：1. 线程池配置需指定拒绝策略；2. 异步日志收集建议接入 Disruptor 无锁队列提升吞吐量。',
    latencyMs: 1420,
    ttftMs: 320,
    statusCode: 200,
    costCny: 0.04656,
    ipAddress: '10.200.12.88',
  },
  {
    id: 'tr-20260316-9902',
    timestamp: '2026-03-16 22:26:45',
    apiKeyId: 'key-01',
    apiKeyName: '智能客服工单助手 (客服 Agent)',
    userId: 'usr-001',
    userName: '张主管 (客服运营)',
    providerId: 'prov-deepseek',
    providerName: 'DeepSeek (深度求索)',
    modelId: 'deepseek-v3',
    modelName: 'DeepSeek-V3 (通用旗舰)',
    promptTokens: 520,
    completionTokens: 380,
    totalTokens: 900,
    promptSnippet: '用户投诉物流超时3天未更新，当前包裹状态为分拣中，请起草安抚信并提供补发优惠券方案。',
    responseSnippet: '尊敬的客户您好，非常抱歉给您带来困扰！经系统核查您的包裹目前正加急调度。我们已为您申请了 20 元无门槛运费补贴券，并有专属客服全程跟进跟踪...',
    latencyMs: 410,
    ttftMs: 110,
    statusCode: 200,
    costCny: 0.00128,
    ipAddress: '10.10.2.45',
  },
  {
    id: 'tr-20260316-9903',
    timestamp: '2026-03-16 22:24:12',
    apiKeyId: 'key-02',
    apiKeyName: '智能代码审查与研发 Copilot',
    userId: 'usr-002',
    userName: '李架构 (基础研发)',
    providerId: 'prov-anthropic',
    providerName: 'Anthropic Claude',
    modelId: 'claude-3-5-sonnet',
    modelName: 'Claude 3.5 Sonnet (代码王牌)',
    promptTokens: 3400,
    completionTokens: 1890,
    totalTokens: 5290,
    promptSnippet: '将这段遗留的 Vue 2 Options API 组件全面升级重构为 Vue 3 Composition API 与 Element Plus 组件规范...',
    responseSnippet: '以下是重构成 Vue 3 `<script setup lang="ts">` 的完整代码，使用 ref/computed 替代原有 data/methods，并升级了 Element Plus 响应式布局...',
    latencyMs: 1680,
    ttftMs: 450,
    statusCode: 200,
    costCny: 0.27756,
    ipAddress: '10.200.12.88',
  },
  {
    id: 'tr-20260316-9904',
    timestamp: '2026-03-16 22:20:00',
    apiKeyId: 'key-03',
    apiKeyName: '企业财务报表智能归因系统',
    userId: 'usr-003',
    userName: '王总监 (财务审计)',
    providerId: 'prov-openai',
    providerName: 'OpenAI (公有云通道)',
    modelId: 'gpt-4o',
    modelName: 'GPT-4o (Omni 原生多模态)',
    promptTokens: 4200,
    completionTokens: 1200,
    totalTokens: 5400,
    promptSnippet: '对比分析 Q3 与 Q4 研发算力开销波动原因，计算环比增长率并生成结构化风险评估。',
    responseSnippet: '根据输入财务数据核算：Q4 算力支出总计 482,000 元，环比增长 24.6%。主要增长点为深度推理模型与本地 GPU 集群电费分摊。建议开启闲时算力低价调度策略。',
    latencyMs: 1150,
    ttftMs: 380,
    statusCode: 200,
    costCny: 0.162,
    ipAddress: '10.50.12.33',
  },
  {
    id: 'tr-20260316-9905',
    timestamp: '2026-03-16 22:15:20',
    apiKeyId: 'key-05',
    apiKeyName: '算法预研与模型压测测试沙箱',
    userId: 'usr-002',
    userName: '李架构 (基础研发)',
    providerId: 'prov-ollama',
    providerName: '私有算力集群 (Ollama K8s)',
    modelId: 'llama3-70b-local',
    modelName: 'Llama 3 70B (本地高性能版)',
    promptTokens: 890,
    completionTokens: 420,
    totalTokens: 1310,
    promptSnippet: '内部敏感客户信审数据分类打标：测试实体提取准确度。',
    responseSnippet: '提取结果：姓名=[脱敏-客户A]，评级=[AAA]，违约概率预测值=[0.02%]。处理耗时 120ms，机房直连无公网暴露。',
    latencyMs: 180,
    ttftMs: 45,
    statusCode: 200,
    costCny: 0.0,
    ipAddress: '127.0.0.1',
  },
  {
    id: 'tr-20260316-9906',
    timestamp: '2026-03-16 22:10:05',
    apiKeyId: 'key-01',
    apiKeyName: '智能客服工单助手 (客服 Agent)',
    userId: 'usr-001',
    userName: '张主管 (客服运营)',
    providerId: 'prov-qwen',
    providerName: '通义千问 (Qwen-Max)',
    modelId: 'qwen-max',
    modelName: 'Qwen-Max (通义超大规模版)',
    promptTokens: 680,
    completionTokens: 290,
    totalTokens: 970,
    promptSnippet: '客户咨询企业 VIP 年卡会员自动续费扣款协议细则。',
    responseSnippet: '协议条款第 4.2 条规定：自动续费前 5 日将通过短信与 App Push 发送提醒，用户可随时在“个人设置-增值订阅”一键取消，无需支付额外违约金。',
    latencyMs: 380,
    ttftMs: 95,
    statusCode: 200,
    costCny: 0.031,
    ipAddress: '10.10.2.45',
  },
  {
    id: 'tr-20260316-9907',
    timestamp: '2026-03-16 22:01:14',
    apiKeyId: 'key-05',
    apiKeyName: '算法预研与模型压测测试沙箱',
    userId: 'usr-002',
    userName: '李架构 (基础研发)',
    providerId: 'prov-openai',
    providerName: 'OpenAI (公有云通道)',
    modelId: 'o1-preview',
    modelName: 'OpenAI o1 (科研慢思考模型)',
    promptTokens: 500,
    completionTokens: 0,
    totalTokens: 500,
    promptSnippet: '突发瞬时 1000 并发压测测试请求...',
    responseSnippet: '',
    latencyMs: 120,
    ttftMs: 0,
    statusCode: 429,
    costCny: 0.0,
    ipAddress: '127.0.0.1',
    errorMessage: 'Rate limit exceeded: 429 Too Many Requests (RPM limit: 60 reached)',
  },
];

// Helper function to load users with local database fallback
function loadUsersFromStorage(): User[] {
  try {
    const saved = localStorage.getItem('maas_users_database');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load users from local storage:', e);
  }
  return [...initialUsers];
}

function persistUsersToStorage() {
  try {
    localStorage.setItem('maas_users_database', JSON.stringify(store.users));
  } catch (e) {
    console.error('Failed to persist users to database storage:', e);
  }
}

// Preset avatar pool for instant selection
export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&fit=crop&q=80',
];

/**
 * Reads an image File, compresses it to max 300x300, and returns a Base64 Data URL
 * suitable for database storage.
 */
export function compressAndConvertImageToBase64(
  file: File,
  maxDimension = 300,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('请选择有效的图片文件 (JPG, PNG, WebP, GIF)'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const img = new Image();
      img.src = result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG compression or PNG if transparency needed
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const compressedBase64 = canvas.toDataURL(mimeType, quality);
        resolve(compressedBase64);
      };
      img.onerror = () => resolve(result);
    };
    reader.onerror = (err) => reject(err);
  });
}

// Reactive Store State
export const store = reactive({
  isLoggedIn: true,
  users: loadUsersFromStorage(),
  providers: [...initialProviders],
  apiKeys: [...initialApiKeys],
  logs: [...initialLogs],
  currentView: 'overview' as 'overview' | 'providers' | 'apikeys' | 'monitoring' | 'billing' | 'playground' | 'users' | 'login',
  activeRole: 'admin' as 'admin' | 'developer' | 'finance',
  searchQuery: '',
});

// Helper actions
export function setCurrentUser(u: User) {
  currentUser.id = u.id;
  currentUser.username = u.username;
  currentUser.password = u.password;
  currentUser.name = u.name;
  currentUser.email = u.email;
  currentUser.phone = u.phone;
  currentUser.avatar = u.avatar;
  currentUser.role = u.role;
  currentUser.roleLabel = u.roleLabel;
  currentUser.department = u.department;
  currentUser.organization = u.organization;
  currentUser.status = u.status;
  currentUser.monthlyQuotaCny = u.monthlyQuotaCny;
  currentUser.lastLoginAt = u.lastLoginAt;
  currentUser.createdAt = u.createdAt;
  store.activeRole = u.role;
}

export function loginUser(username: string, password?: string): { success: boolean; message: string; user?: User } {
  const cleanUsername = username.trim().toLowerCase();
  const matched = store.users.find(u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername);
  
  if (!matched) {
    return { success: false, message: '账号不存在，请检查后重新输入' };
  }
  
  if (matched.status === 'disabled') {
    return { success: false, message: '该账号已被系统管理员冻结禁用，请联系平台管理员' };
  }
  
  if (password && matched.password && matched.password !== password) {
    return { success: false, message: '密码错误，请重新输入（默认体验密码：password123 或 123456）' };
  }

  // Update last login
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  matched.lastLoginAt = nowStr;
  
  setCurrentUser(matched);
  store.isLoggedIn = true;
  store.currentView = 'overview';
  
  return { success: true, message: `欢迎回来，${matched.name}！`, user: matched };
}

export function logoutUser() {
  store.isLoggedIn = false;
  store.currentView = 'login';
}

export function saveUser(user: User, isNew = false) {
  if (isNew) {
    store.users.unshift(user);
  } else {
    const idx = store.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      store.users[idx] = { ...user };
      if (currentUser.id === user.id) {
        setCurrentUser(user);
      }
    }
  }
  persistUsersToStorage();
}

export function removeUser(userId: string): boolean {
  if (currentUser.id === userId) {
    return false;
  }
  const idx = store.users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    store.users.splice(idx, 1);
    persistUsersToStorage();
    return true;
  }
  return false;
}

// MySQL Tables Metadata
export const mysqlTables: MySQLTable[] = [
  {
    name: 'sys_user',
    comment: '系统用户及租户组织表',
    engine: 'InnoDB',
    rowCount: 3,
    dataSizeKb: 16,
    columns: [
      { field: 'id', type: 'varchar(64)', nullable: false, key: 'PRI', defaultValue: null, comment: '用户唯一ID' },
      { field: 'username', type: 'varchar(64)', nullable: false, key: 'UNI', defaultValue: null, comment: '登录账号' },
      { field: 'password_hash', type: 'varchar(255)', nullable: false, key: '', defaultValue: null, comment: '哈希密码' },
      { field: 'real_name', type: 'varchar(64)', nullable: false, key: '', defaultValue: null, comment: '真实姓名' },
      { field: 'role', type: 'varchar(32)', nullable: false, key: '', defaultValue: 'developer', comment: '角色' },
      { field: 'department', type: 'varchar(64)', nullable: false, key: 'MUL', defaultValue: '研发中心', comment: '归属部门' },
      { field: 'status', type: 'tinyint', nullable: false, key: '', defaultValue: '1', comment: '1-启用' },
      { field: 'created_at', type: 'datetime', nullable: false, key: '', defaultValue: 'CURRENT_TIMESTAMP', comment: '创建时间' },
    ],
  },
  {
    name: 'llm_provider',
    comment: '大模型上游供应商管理表',
    engine: 'InnoDB',
    rowCount: 5,
    dataSizeKb: 32,
    columns: [
      { field: 'id', type: 'varchar(64)', nullable: false, key: 'PRI', defaultValue: null, comment: '供应商ID' },
      { field: 'code', type: 'varchar(64)', nullable: false, key: 'UNI', defaultValue: null, comment: '唯一标识码' },
      { field: 'name', type: 'varchar(128)', nullable: false, key: '', defaultValue: null, comment: '显示名称' },
      { field: 'protocol', type: 'varchar(32)', nullable: false, key: '', defaultValue: 'openai-compatible', comment: '通信协议' },
      { field: 'base_url', type: 'varchar(255)', nullable: false, key: '', defaultValue: null, comment: '基地址URL' },
      { field: 'api_key', type: 'varchar(255)', nullable: false, key: '', defaultValue: null, comment: '加密凭证' },
      { field: 'status', type: 'varchar(32)', nullable: false, key: '', defaultValue: 'active', comment: '状态' },
      { field: 'latency_ms', type: 'int', nullable: false, key: '', defaultValue: '0', comment: '延迟ms' },
      { field: 'weight', type: 'int', nullable: false, key: '', defaultValue: '100', comment: '权重' },
    ],
  },
  {
    name: 'llm_model',
    comment: '大模型基础目录与计费单价表',
    engine: 'InnoDB',
    rowCount: 7,
    dataSizeKb: 32,
    columns: [
      { field: 'id', type: 'varchar(64)', nullable: false, key: 'PRI', defaultValue: null, comment: '模型型号ID' },
      { field: 'provider_id', type: 'varchar(64)', nullable: false, key: 'MUL', defaultValue: null, comment: '关联供应商' },
      { field: 'name', type: 'varchar(128)', nullable: false, key: '', defaultValue: null, comment: '标头名称' },
      { field: 'display_name', type: 'varchar(128)', nullable: false, key: '', defaultValue: null, comment: '展示名称' },
      { field: 'category', type: 'varchar(32)', nullable: false, key: '', defaultValue: 'chat', comment: '模型类别' },
      { field: 'price_prompt_per_million', type: 'decimal(10,4)', nullable: false, key: '', defaultValue: '0.0000', comment: '输入单价元/M' },
      { field: 'price_completion_per_million', type: 'decimal(10,4)', nullable: false, key: '', defaultValue: '0.0000', comment: '输出单价元/M' },
      { field: 'enabled', type: 'tinyint', nullable: false, key: '', defaultValue: '1', comment: '1-启用' },
    ],
  },
  {
    name: 'gateway_api_key',
    comment: '统一网关 API 密钥与配额流控表',
    engine: 'InnoDB',
    rowCount: 5,
    dataSizeKb: 48,
    columns: [
      { field: 'id', type: 'varchar(64)', nullable: false, key: 'PRI', defaultValue: null, comment: '密钥主键' },
      { field: 'name', type: 'varchar(128)', nullable: false, key: '', defaultValue: null, comment: '业务名称' },
      { field: 'secret_token', type: 'varchar(255)', nullable: false, key: 'UNI', defaultValue: null, comment: '统一网关调用Token' },
      { field: 'user_id', type: 'varchar(64)', nullable: false, key: 'MUL', defaultValue: null, comment: '责任人' },
      { field: 'department', type: 'varchar(64)', nullable: false, key: '', defaultValue: null, comment: '核算部门' },
      { field: 'status', type: 'varchar(32)', nullable: false, key: '', defaultValue: 'active', comment: '状态' },
      { field: 'rate_limit_rpm', type: 'int', nullable: false, key: '', defaultValue: '600', comment: '每分钟请求限制' },
      { field: 'rate_limit_tpm', type: 'int', nullable: false, key: '', defaultValue: '300000', comment: '每分钟Token限制' },
      { field: 'monthly_quota_cny', type: 'decimal(12,2)', nullable: false, key: '', defaultValue: '5000.00', comment: '月度预算元' },
      { field: 'used_quota_cny', type: 'decimal(12,4)', nullable: false, key: '', defaultValue: '0.0000', comment: '当月已消耗元' },
    ],
  },
  {
    name: 'gateway_invocation_log',
    comment: '网关链路调用日志与全生命周期审计表',
    engine: 'InnoDB',
    rowCount: 7,
    dataSizeKb: 128,
    columns: [
      { field: 'id', type: 'varchar(64)', nullable: false, key: 'PRI', defaultValue: null, comment: 'Trace ID' },
      { field: 'api_key_id', type: 'varchar(64)', nullable: false, key: 'MUL', defaultValue: null, comment: '密钥ID' },
      { field: 'provider_id', type: 'varchar(64)', nullable: false, key: 'MUL', defaultValue: null, comment: '实际供应商' },
      { field: 'model_id', type: 'varchar(64)', nullable: false, key: '', defaultValue: null, comment: '调用模型' },
      { field: 'prompt_tokens', type: 'int', nullable: false, key: '', defaultValue: '0', comment: '输入Token' },
      { field: 'completion_tokens', type: 'int', nullable: false, key: '', defaultValue: '0', comment: '输出Token' },
      { field: 'latency_ms', type: 'int', nullable: false, key: '', defaultValue: '0', comment: '延迟ms' },
      { field: 'ttft_ms', type: 'int', nullable: false, key: '', defaultValue: '0', comment: '首字时延ms' },
      { field: 'status_code', type: 'int', nullable: false, key: 'MUL', defaultValue: '200', comment: 'HTTP状态码' },
      { field: 'cost_cny', type: 'decimal(10,6)', nullable: false, key: '', defaultValue: '0.000000', comment: '费用元' },
      { field: 'created_at', type: 'datetime', nullable: false, key: 'MUL', defaultValue: 'CURRENT_TIMESTAMP', comment: '调用时间' },
    ],
  },
];

// SQL Query Runner simulation
export function runSimulatedSqlQuery(query: string): SqlQueryResult {
  const cleanSql = query.trim().toLowerCase();
  const startTime = performance.now();

  try {
    if (cleanSql.includes('from sys_user')) {
      const rows = store.users.map(u => ({
        id: u.id,
        username: u.username,
        password_hash: '$2a$10$e8w...' + u.username.slice(0, 3) + '***',
        real_name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        status: u.status === 'active' ? 1 : 0,
        monthly_quota_cny: u.monthlyQuotaCny || 0,
        created_at: u.createdAt,
      }));
      return {
        sql: query,
        columns: ['id', 'username', 'password_hash', 'real_name', 'email', 'role', 'department', 'status', 'monthly_quota_cny', 'created_at'],
        rows,
        affectedRows: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 8),
        status: 'success',
      };
    } else if (cleanSql.includes('from llm_provider')) {
      const rows = store.providers.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        protocol: p.protocol,
        base_url: p.baseUrl,
        status: p.status,
        latency_ms: p.latencyMs,
        weight: p.weight,
        is_custom: p.isCustom ? 1 : 0,
      }));
      return {
        sql: query,
        columns: ['id', 'code', 'name', 'protocol', 'base_url', 'status', 'latency_ms', 'weight', 'is_custom'],
        rows,
        affectedRows: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 12),
        status: 'success',
      };
    } else if (cleanSql.includes('from gateway_api_key')) {
      const rows = store.apiKeys.map(k => ({
        id: k.id,
        name: k.name,
        secret_token: k.keyPrefix + '...',
        department: k.department,
        status: k.status,
        rate_limit_rpm: k.rateLimitRpm,
        monthly_quota_cny: k.monthlyQuotaCny,
        used_quota_cny: k.usedQuotaCny,
        total_calls: k.totalCalls,
      }));
      return {
        sql: query,
        columns: ['id', 'name', 'secret_token', 'department', 'status', 'rate_limit_rpm', 'monthly_quota_cny', 'used_quota_cny', 'total_calls'],
        rows,
        affectedRows: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 15),
        status: 'success',
      };
    } else {
      // Default query on logs or summary
      const rows = store.logs.slice(0, 5).map(l => ({
        id: l.id,
        api_key_name: l.apiKeyName,
        model_name: l.modelName,
        prompt_tokens: l.promptTokens,
        completion_tokens: l.completionTokens,
        latency_ms: l.latencyMs,
        status_code: l.statusCode,
        cost_cny: l.costCny.toFixed(5),
      }));
      return {
        sql: query,
        columns: ['id', 'api_key_name', 'model_name', 'prompt_tokens', 'completion_tokens', 'latency_ms', 'status_code', 'cost_cny'],
        rows,
        affectedRows: rows.length,
        executionTimeMs: Math.round(performance.now() - startTime + 9),
        status: 'success',
      };
    }
  } catch (err: any) {
    return {
      sql: query,
      columns: [],
      rows: [],
      affectedRows: 0,
      executionTimeMs: 10,
      status: 'error',
      errorMessage: err?.message || 'SQL Execution Syntax Error',
    };
  }
}
