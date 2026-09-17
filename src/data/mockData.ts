import { User, Provider, ApiKeyConfig, InvocationLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-01',
    username: 'admin',
    password: 'password123',
    name: '张明',
    email: 'zhangming@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    roleLabel: '系统超级管理员',
    department: '基础技术平台架构部',
    organization: '智元科技有限公司',
    status: 'active',
    createdAt: '2026-01-01 00:00:00',
  },
  {
    id: 'usr-dev-02',
    username: 'developer',
    password: 'password123',
    name: '李维',
    email: 'liwei@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'developer',
    roleLabel: '大模型应用研发专家',
    department: '智能客服与Copilot研发组',
    organization: '智元科技有限公司',
    status: 'active',
    createdAt: '2026-01-05 10:00:00',
  },
  {
    id: 'usr-fin-03',
    username: 'finance',
    password: 'password123',
    name: '王芳',
    email: 'wangfang@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'finance',
    roleLabel: '云资源成本审计官',
    department: '企业财务与算力运营部',
    organization: '智元科技有限公司',
    status: 'active',
    createdAt: '2026-02-01 08:30:00',
  }
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-deepseek',
    name: 'DeepSeek 深度求索',
    code: 'deepseek',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: 'sk-ds-99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4',
    status: 'active',
    latencyMs: 380,
    errorRate: 0.2,
    weight: 95,
    isCustom: false,
    description: '深度求索新一代低延迟高性价比推理与通用基座模型，原生支持OpenAI格式。',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-02-18T10:30:00Z',
    models: [
      {
        id: 'deepseek-chat',
        name: 'deepseek-chat',
        displayName: 'DeepSeek-V3 (通用大模型)',
        providerId: 'prov-deepseek',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 1.0, completionPerMillion: 2.0 },
        enabled: true,
        category: 'chat',
        description: '高吞吐超低价格主力通用模型，适合对话、摘要与常规NLP任务。'
      },
      {
        id: 'deepseek-reasoner',
        name: 'deepseek-reasoner',
        displayName: 'DeepSeek-R1 (深度推理大模型)',
        providerId: 'prov-deepseek',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 4.0, completionPerMillion: 16.0 },
        enabled: true,
        category: 'reasoning',
        description: '拥有长思维链(CoT)能力，专为复杂数学、算法代码和逻辑推理优化。'
      }
    ]
  },
  {
    id: 'prov-openai',
    name: 'OpenAI 官方服务',
    code: 'openai',
    protocol: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-proj-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    status: 'active',
    latencyMs: 620,
    errorRate: 0.4,
    weight: 80,
    isCustom: false,
    description: '行业标杆级多模态模型家族，涵盖旗舰级推理及紧凑高效模型。',
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-02-20T14:15:00Z',
    models: [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        displayName: 'GPT-4o (全能多模态旗舰)',
        providerId: 'prov-openai',
        contextWindow: 128000,
        maxOutputTokens: 16384,
        pricing: { promptPerMillion: 18.0, completionPerMillion: 72.0 },
        enabled: true,
        category: 'chat',
        description: '全能旗舰模型，兼具高智商与高速响应，全面支持文本与多模态。'
      },
      {
        id: 'gpt-4o-mini',
        name: 'gpt-4o-mini',
        displayName: 'GPT-4o mini (紧凑低成本)',
        providerId: 'prov-openai',
        contextWindow: 128000,
        maxOutputTokens: 16384,
        pricing: { promptPerMillion: 1.1, completionPerMillion: 4.4 },
        enabled: true,
        category: 'chat',
        description: '高性价比精简模型，适合大规模客服问答和批处理流水线。'
      }
    ]
  },
  {
    id: 'prov-anthropic',
    name: 'Anthropic Claude',
    code: 'anthropic',
    protocol: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: 'sk-ant-api03-abcdef1234567890abcdef1234567890',
    status: 'active',
    latencyMs: 540,
    errorRate: 0.1,
    weight: 85,
    isCustom: false,
    description: '专注于安全性、复杂上下文理解和专业代码编写的高级推理模型系列。',
    createdAt: '2025-01-12T11:00:00Z',
    updatedAt: '2025-02-15T09:20:00Z',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'claude-3-5-sonnet-20241022',
        displayName: 'Claude 3.5 Sonnet (代码与逻辑专家)',
        providerId: 'prov-anthropic',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 21.6, completionPerMillion: 108.0 },
        enabled: true,
        category: 'code',
        description: '业内公认代码生成、多步工具调用和长文架构分析顶级模型。'
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'claude-3-5-haiku-20241022',
        displayName: 'Claude 3.5 Haiku (极致轻量速度)',
        providerId: 'prov-anthropic',
        contextWindow: 200000,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 5.8, completionPerMillion: 28.8 },
        enabled: true,
        category: 'chat',
        description: '极低延迟响应，极佳的轻量交互体验与长上下文过滤能力。'
      }
    ]
  },
  {
    id: 'prov-qwen',
    name: '阿里云 通义千问',
    code: 'qwen',
    protocol: 'openai-compatible',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: 'sk-aliyun-dashscope-9928192837192837129',
    status: 'active',
    latencyMs: 290,
    errorRate: 0.15,
    weight: 90,
    isCustom: false,
    description: '阿里云百炼平台千亿级大模型，国内合规完备，中文语义及行业知识储备深厚。',
    createdAt: '2025-01-15T15:00:00Z',
    updatedAt: '2025-02-22T16:00:00Z',
    models: [
      {
        id: 'qwen-max',
        name: 'qwen-max',
        displayName: 'Qwen-Max (通义千问超大规模旗舰)',
        providerId: 'prov-qwen',
        contextWindow: 32768,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 16.0, completionPerMillion: 48.0 },
        enabled: true,
        category: 'chat',
        description: '通义家族最强基座，适合企业战略文书生成与多轮深度推演。'
      },
      {
        id: 'qwen-plus',
        name: 'qwen-plus',
        displayName: 'Qwen-Plus (高性价比平衡版)',
        providerId: 'prov-qwen',
        contextWindow: 131072,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 3.2, completionPerMillion: 9.6 },
        enabled: true,
        category: 'chat',
        description: '能力与速度极佳平衡，支持超长上下文，支持复杂长文本阅读。'
      }
    ]
  },
  {
    id: 'prov-zhipu',
    name: '智谱 AI (GLM)',
    code: 'zhipu',
    protocol: 'openai-compatible',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: 'sk-zhipu-glm-4-token-9812739812739182',
    status: 'active',
    latencyMs: 410,
    errorRate: 0.3,
    weight: 75,
    isCustom: false,
    description: '清华系全自主研发中英双语GLM架构，具备突出的学术科研与长文本智能。',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-02-21T11:45:00Z',
    models: [
      {
        id: 'glm-4-plus',
        name: 'glm-4-plus',
        displayName: 'GLM-4-Plus (智谱全能旗舰)',
        providerId: 'prov-zhipu',
        contextWindow: 128000,
        maxOutputTokens: 4096,
        pricing: { promptPerMillion: 10.0, completionPerMillion: 10.0 },
        enabled: true,
        category: 'chat',
        description: '全面升级的大脑基座，擅长指令遵循、Agent编排与复杂长句梳理。'
      }
    ]
  },
  {
    id: 'prov-ollama',
    name: '私有化算力集群 (vLLM / Ollama)',
    code: 'ollama',
    protocol: 'ollama',
    baseUrl: 'http://ai-cluster.internal.net:11434',
    apiKey: 'internal-bearer-token-cluster-vpc-2025',
    status: 'active',
    latencyMs: 120,
    errorRate: 0.05,
    weight: 100,
    isCustom: true,
    description: '企业内网私有GPU服务器阵列部署，无外部网络依赖，数据100%本地留存。',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-25T17:00:00Z',
    models: [
      {
        id: 'qwen2.5-coder:32b',
        name: 'qwen2.5-coder:32b',
        displayName: 'Qwen2.5-Coder-32B (本地代码专用)',
        providerId: 'prov-ollama',
        contextWindow: 65536,
        maxOutputTokens: 8192,
        pricing: { promptPerMillion: 0.0, completionPerMillion: 0.0 },
        enabled: true,
        category: 'code',
        description: '内部机房专属硬件运行，调用费用为零，服务企业内部IDE代码提示。'
      },
      {
        id: 'deepseek-r1:70b-internal',
        name: 'deepseek-r1:70b-internal',
        displayName: 'DeepSeek-R1-Distill-70B (本地私有)',
        providerId: 'prov-ollama',
        contextWindow: 32768,
        maxOutputTokens: 4096,
        pricing: { promptPerMillion: 0.0, completionPerMillion: 0.0 },
        enabled: true,
        category: 'reasoning',
        description: '蒸馏至70B的深度推理模型，用于金融保密合同审查与内部业务逻辑校验。'
      }
    ]
  }
];

export const INITIAL_API_KEYS: ApiKeyConfig[] = [
  {
    id: 'key-01',
    name: '生产环境-智能客服中心',
    keyPrefix: 'maas-sk-prod-9a8b7c6d',
    fullKey: 'maas-sk-prod-9a8b7c6d8e7f6a5b4c3d2e1f0',
    userId: 'usr-admin-01',
    userName: '张明',
    department: '智能客服中心',
    status: 'active',
    allowedModels: ['*'],
    rateLimitRpm: 1200,
    rateLimitTpm: 600000,
    monthlyQuotaCny: 15000,
    usedQuotaCny: 4820.45,
    totalCalls: 128450,
    createdAt: '2025-01-10T10:00:00Z',
    lastUsedAt: '2025-02-28T08:12:00Z',
    ipWhitelist: ['192.168.1.0/24', '10.0.0.15']
  },
  {
    id: 'key-02',
    name: '研发测试-Copilot编程助手插件',
    keyPrefix: 'maas-sk-dev-4f5e6d7c',
    fullKey: 'maas-sk-dev-4f5e6d7c8b9a0123456789abcdef',
    userId: 'usr-dev-02',
    userName: '李维',
    department: '智能客服与Copilot研发组',
    status: 'active',
    allowedModels: ['claude-3-5-sonnet-20241022', 'qwen2.5-coder:32b', 'deepseek-reasoner'],
    rateLimitRpm: 300,
    rateLimitTpm: 200000,
    monthlyQuotaCny: 5000,
    usedQuotaCny: 1890.30,
    totalCalls: 34210,
    createdAt: '2025-01-18T14:30:00Z',
    lastUsedAt: '2025-02-28T08:14:22Z',
    ipWhitelist: []
  },
  {
    id: 'key-03',
    name: 'BI经营分析-财报长文解析服务',
    keyPrefix: 'maas-sk-bi-11223344',
    fullKey: 'maas-sk-bi-112233445566778899aabbcc',
    userId: 'usr-fin-03',
    userName: '王芳',
    department: '企业财务与算力运营部',
    status: 'active',
    allowedModels: ['deepseek-chat', 'gpt-4o', 'qwen-max'],
    rateLimitRpm: 120,
    rateLimitTpm: 150000,
    monthlyQuotaCny: 3000,
    usedQuotaCny: 745.80,
    totalCalls: 8930,
    createdAt: '2025-02-01T09:00:00Z',
    lastUsedAt: '2025-02-27T18:05:10Z',
    ipWhitelist: ['10.10.88.0/24']
  },
  {
    id: 'key-04',
    name: '灰度测试-营销文案自动生成应用',
    keyPrefix: 'maas-sk-canary-778899aa',
    fullKey: 'maas-sk-canary-778899aabbccddeeff001122',
    userId: 'usr-dev-02',
    userName: '李维',
    department: '市场与数字化运营部',
    status: 'disabled',
    allowedModels: ['gpt-4o-mini', 'qwen-plus'],
    rateLimitRpm: 60,
    rateLimitTpm: 50000,
    monthlyQuotaCny: 1000,
    usedQuotaCny: 230.15,
    totalCalls: 3120,
    createdAt: '2025-02-12T16:00:00Z',
    lastUsedAt: '2025-02-25T11:20:00Z',
    ipWhitelist: []
  }
];

// Helper to generate realistic past logs
export function generateSeedLogs(): InvocationLog[] {
  const samplePrompts = [
    {
      prompt: '请分析该用户的购买退换货记录，并提取出核心纠纷点：订单号#982103，客户称收到商品有外包装磨损...',
      response: '【纠纷要点归纳】：1. 物流签收外观争议：外包装角部有轻微挤压受损；2. 诉求：用户希望换货并补发赠品积分。建议策略：支持极速退换货，附赠运费险补偿。',
      model: 'deepseek-chat',
      provider: 'prov-deepseek',
      provName: 'DeepSeek 深度求索',
      modName: 'DeepSeek-V3',
      pTokens: 382,
      cTokens: 145,
      costRate: 1.0,
      cCostRate: 2.0,
      latency: 280,
      ttft: 180,
      keyId: 'key-01',
      keyName: '生产环境-智能客服中心',
      user: '张明',
      userId: 'usr-admin-01'
    },
    {
      prompt: '编写一个针对海量时间序列的滑动窗口异常检测算法，使用 PyTorch 实现双向 GRU 并在最后一层加入注意力池化。',
      response: '```python\nimport torch\nimport torch.nn as nn\n\nclass TemporalAnomalyDetector(nn.Module):\n    def __init__(self, input_dim, hidden_dim=64, num_layers=2):\n        super().__init__()\n        self.gru = nn.GRU(input_dim, hidden_dim, num_layers=num_layers, batch_first=True, bidirectional=True)\n        self.attn = nn.Linear(hidden_dim * 2, 1)\n        self.classifier = nn.Linear(hidden_dim * 2, 1)\n    def forward(self, x):\n        out, _ = self.gru(x)\n        w = torch.softmax(self.attn(out), dim=1)\n        pooled = torch.sum(out * w, dim=1)\n        return torch.sigmoid(self.classifier(pooled))\n```',
      model: 'claude-3-5-sonnet-20241022',
      provider: 'prov-anthropic',
      provName: 'Anthropic Claude',
      modName: 'Claude 3.5 Sonnet',
      pTokens: 520,
      cTokens: 412,
      costRate: 21.6,
      cCostRate: 108.0,
      latency: 740,
      ttft: 310,
      keyId: 'key-02',
      keyName: '研发测试-Copilot编程助手插件',
      user: '李维',
      userId: 'usr-dev-02'
    },
    {
      prompt: '证明若函数 f 在闭区间 [a, b] 上连续，在开区间 (a, b) 内可导，且 f(a) = f(b)，则至少存在一点 xi 使得 f\'(xi) = 0。',
      response: '<think>\n这是经典的罗尔定理证明题。分两种情况：\n1. 若 f(x) 在 [a,b] 上为常数函数，则对任意 x in (a,b)，导数恒为0；\n2. 若 f(x) 非常数，根据闭区间连续函数介值极值定理，f 必在 [a,b] 上取得最大值 M 和最小值 m。由 f(a)=f(b) 及非常数假设，M 和 m 至少有一个在开区间 (a,b) 内取得，记该点为 xi。由费马引理，极值点处导数必为 0。\n</think>\n证明完毕：通过闭区间最大最小值定理与费马引理即证。',
      model: 'deepseek-reasoner',
      provider: 'prov-deepseek',
      provName: 'DeepSeek 深度求索',
      modName: 'DeepSeek-R1',
      pTokens: 420,
      cTokens: 380,
      costRate: 4.0,
      cCostRate: 16.0,
      latency: 890,
      ttft: 450,
      keyId: 'key-02',
      keyName: '研发测试-Copilot编程助手插件',
      user: '李维',
      userId: 'usr-dev-02'
    },
    {
      prompt: '对 2024 Q4 集团云计算基础设施采购账单进行结构化汇总，按机房位置与电费折旧分类。',
      response: '根据账单分析，Q4 集团算力总支出为 142.8 万元。其中：华东一区（上海）占比 48.2%，电费与冷却折旧费计 18.4 万元；华北二区（乌兰察布风电节点）占比 36.1%，电费成本较华东低 27.5%。',
      model: 'gpt-4o',
      provider: 'prov-openai',
      provName: 'OpenAI 官方服务',
      modName: 'GPT-4o',
      pTokens: 1250,
      cTokens: 290,
      costRate: 18.0,
      cCostRate: 72.0,
      latency: 610,
      ttft: 280,
      keyId: 'key-03',
      keyName: 'BI经营分析-财报长文解析服务',
      user: '王芳',
      userId: 'usr-fin-03'
    },
    {
      prompt: '针对内部员工请假考勤自动化脚本，解析从钉钉审批流推送过来的 JSON 数据并校验剩余年假。',
      response: '已完成解析。输入数据包含字段：userId, leaveType, startDay, endDay。经规则引擎核验，员工当前剩余年假 4.5 天，本次申请 2 天，核验通过，已向 ERP 系统发送扣减指令。',
      model: 'qwen2.5-coder:32b',
      provider: 'prov-ollama',
      provName: '私有化算力集群 (vLLM)',
      modName: 'Qwen2.5-Coder-32B',
      pTokens: 280,
      cTokens: 110,
      costRate: 0.0,
      cCostRate: 0.0,
      latency: 115,
      ttft: 45,
      keyId: 'key-02',
      keyName: '研发测试-Copilot编程助手插件',
      user: '李维',
      userId: 'usr-dev-02'
    },
    {
      prompt: '为新发布的 SaaS 协同白板功能撰写一段 100 字的弹窗公告，风格科技感、简洁现代。',
      response: '【灵感无界，同频共创】全新协作白板已正式上线！支持万级思维节点实时流式渲染、跨时区毫秒级光标同步与 AI 结构化一键成图。释放团队无尽可能，即刻体验下一代灵感工作台。',
      model: 'qwen-plus',
      provider: 'prov-qwen',
      provName: '阿里云 通义千问',
      modName: 'Qwen-Plus',
      pTokens: 195,
      cTokens: 130,
      costRate: 3.2,
      cCostRate: 9.6,
      latency: 260,
      ttft: 140,
      keyId: 'key-01',
      keyName: '生产环境-智能客服中心',
      user: '张明',
      userId: 'usr-admin-01'
    }
  ];

  const logs: InvocationLog[] = [];
  const now = Date.now();

  // Generate 45 historical log records spread across the last 3 days
  for (let i = 0; i < 45; i++) {
    const sample = samplePrompts[i % samplePrompts.length];
    const timeOffset = Math.floor((i * 1.6 + Math.random() * 0.8) * 3600 * 1000);
    const timestamp = new Date(now - timeOffset).toISOString();

    const isRateLimited = i === 14;
    const isServerError = i === 29;
    const statusCode = isRateLimited ? 429 : isServerError ? 502 : 200;

    const pTokens = sample.pTokens + Math.floor((Math.random() - 0.5) * 60);
    const cTokens = isRateLimited || isServerError ? 0 : sample.cTokens + Math.floor((Math.random() - 0.5) * 40);
    const totalTokens = pTokens + cTokens;

    // Cost calculation: (promptTokens / 1M * promptRate) + (compTokens / 1M * compRate)
    const costCny = Number(
      ((pTokens / 1000000) * sample.costRate + (cTokens / 1000000) * sample.cCostRate).toFixed(5)
    );

    logs.push({
      id: `trace-maas-${100000 + i}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp,
      apiKeyId: sample.keyId,
      apiKeyName: sample.keyName,
      userId: sample.userId,
      userName: sample.user,
      providerId: sample.provider,
      providerName: sample.provName,
      modelId: sample.model,
      modelName: sample.modName,
      promptTokens: pTokens,
      completionTokens: cTokens,
      totalTokens,
      promptSnippet: sample.prompt,
      responseSnippet: isRateLimited
        ? 'Rate limit exceeded: TPM threshold reached for key ' + sample.keyName
        : isServerError
        ? 'Bad Gateway: Upstream provider server response timeout (502)'
        : sample.response,
      latencyMs: isRateLimited ? 18 : isServerError ? 5010 : Math.round(sample.latency + (Math.random() - 0.5) * 80),
      ttftMs: isRateLimited ? 0 : Math.round(sample.ttft + (Math.random() - 0.5) * 40),
      statusCode,
      costCny: isRateLimited || isServerError ? 0 : costCny,
      ipAddress: `192.168.1.${10 + (i % 30)}`,
      errorMessage: isRateLimited ? '429 Rate Limit Exceeded' : isServerError ? '502 Bad Gateway' : undefined
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
