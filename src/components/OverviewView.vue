<template>
  <div class="space-y-6">
    <!-- Top System Welcome & Gateway Status Banner -->
    <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      <div class="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
        <el-icon :size="180"><Cpu /></el-icon>
      </div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold tracking-tight">MaaS Hub 大模型服务治理与网关大盘</h1>
            <el-tag type="success" effect="dark" round size="small">网关集群健康</el-tag>
            <el-tag type="primary" effect="dark" round size="small">网关协议: OpenAI 兼容</el-tag>
          </div>
          <p class="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
            统一调度管理 DeepSeek、OpenAI、Anthropic、通义千问及私有算力集群。提供企业级统一 API Key 鉴权、微秒级流式中继、多级配额流控及细粒度调用审计。
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <el-button type="primary" size="default" :icon="Plus" @click="store.currentView = 'apikeys'">
            创建 API Key
          </el-button>
          <el-button type="warning" size="default" :icon="Connection" @click="store.currentView = 'providers'">
            接入供应商
          </el-button>
          <el-button type="info" size="default" :icon="ChatDotSquare" @click="store.currentView = 'playground'">
            模型沙箱
          </el-button>
        </div>
      </div>

      <!-- Quick Status Indicators -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-indigo-800/60 text-xs">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-slate-300">上游健康度:</span>
          <span class="font-semibold text-emerald-300">100% (5/5 在线)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <span class="text-slate-300">统一网关入口:</span>
          <span class="font-mono text-blue-200">http://localhost:8080/v1</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span class="text-slate-300">安全合规审计:</span>
          <span class="font-mono text-amber-200">全链路脱敏归档</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span class="text-slate-300">流式传输协议:</span>
          <span class="font-mono text-purple-200">SSE (Server-Sent Events)</span>
        </div>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="!border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">已集成供应商 / 模型</span>
            <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <el-icon :size="18"><Connection /></el-icon>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-800">{{ store.providers.length }}</span>
            <span class="text-xs text-slate-500">个供应商 ({{ totalModelsCount }} 款模型)</span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>自建集群: 1 节点</span>
            <span class="text-emerald-600 font-medium">全通道畅通</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="!border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">有效统一 API Key</span>
            <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <el-icon :size="18"><Key /></el-icon>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-800">{{ store.apiKeys.length }}</span>
            <span class="text-xs text-slate-500">个活跃令牌</span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>总调用次数</span>
            <span class="font-mono font-medium text-slate-700">{{ totalCallsFormatted }} 次</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="!border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">24h 消耗 Tokens</span>
            <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <el-icon :size="18"><Histogram /></el-icon>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-800">{{ totalTokens24hFormatted }}</span>
            <span class="text-xs text-emerald-600 font-medium">Tokens</span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>平均响应时延</span>
            <span class="font-medium text-emerald-600">{{ avgLatency }} ms</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="!border-slate-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-500">当月累计算力支出</span>
            <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <el-icon :size="18"><Money /></el-icon>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-800">¥{{ totalCostMonth.toFixed(2) }}</span>
            <span class="text-xs text-slate-500">/ 预警 ¥38,500</span>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>预算消耗率</span>
            <span class="font-medium text-amber-600">{{ quotaUsagePercent }}%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Mid Section: Model Traffic & Active Upstream Providers -->
    <el-row :gutter="16">
      <!-- Left: Upstream Providers Quick Status -->
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="!border-slate-200">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <el-icon class="text-blue-600"><DataLine /></el-icon>
                <span class="font-semibold text-slate-800 text-sm">核心大模型供应商运行态势</span>
              </div>
              <el-button link type="primary" size="small" @click="store.currentView = 'providers'">
                配置全部供应商 &rarr;
              </el-button>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="prov in store.providers"
              :key="prov.id"
              class="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                  <img :src="prov.logoUrl" class="w-full h-full object-contain" :alt="prov.name" />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-slate-800 text-sm truncate">{{ prov.name }}</span>
                    <el-tag v-if="prov.isCustom" size="small" type="warning" effect="plain">私有机房集群</el-tag>
                    <el-tag v-else size="small" type="info" effect="plain">{{ prov.protocol }}</el-tag>
                  </div>
                  <div class="text-xs text-slate-500 mt-0.5 truncate font-mono">
                    {{ prov.baseUrl }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-6 shrink-0">
                <div class="text-right">
                  <div class="text-xs text-slate-500">心跳延迟</div>
                  <div class="font-mono text-xs font-semibold" :class="prov.latencyMs < 300 ? 'text-emerald-600' : 'text-amber-600'">
                    {{ prov.latencyMs }} ms
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-500">多活权重</div>
                  <div class="font-mono text-xs font-semibold text-slate-700">
                    {{ prov.weight }}%
                  </div>
                </div>
                <div class="text-right">
                  <el-tag size="small" :type="prov.status === 'active' ? 'success' : 'danger'" effect="light">
                    {{ prov.status === 'active' ? '健康' : '异常' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Right: Model Usage Distribution -->
      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="!border-slate-200">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <el-icon class="text-indigo-600"><PieChart /></el-icon>
                <span class="font-semibold text-slate-800 text-sm">热门模型调用占比与时延</span>
              </div>
              <el-tag size="small" type="primary" effect="plain">实时统计</el-tag>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">DeepSeek-R1 (深度推理)</span>
                <span class="font-mono text-slate-500">42% (¥0.046/次)</span>
              </div>
              <el-progress :percentage="42" :stroke-width="8" color="#4f46e5" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">DeepSeek-V3 (通用多能)</span>
                <span class="font-mono text-slate-500">28% (¥0.001/次)</span>
              </div>
              <el-progress :percentage="28" :stroke-width="8" color="#0ea5e9" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">Claude 3.5 Sonnet (代码王牌)</span>
                <span class="font-mono text-slate-500">18% (¥0.27/次)</span>
              </div>
              <el-progress :percentage="18" :stroke-width="8" color="#f59e0b" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">GPT-4o (全能多模态)</span>
                <span class="font-mono text-slate-500">8% (¥0.16/次)</span>
              </div>
              <el-progress :percentage="8" :stroke-width="8" color="#10b981" />
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">Llama 3 70B (本地私有机房)</span>
                <span class="font-mono text-slate-500">4% (¥0 内部直连)</span>
              </div>
              <el-progress :percentage="4" :stroke-width="8" color="#8b5cf6" />
            </div>
          </div>

          <div class="mt-5 p-3 bg-blue-50/70 rounded-lg border border-blue-100 flex items-start gap-2.5">
            <el-icon class="text-blue-600 mt-0.5"><InfoFilled /></el-icon>
            <div class="text-xs text-blue-800 leading-relaxed">
              <strong>算力路由优化提示:</strong> 当前国产大模型 (DeepSeek-R1/V3) 承载了全平台 <strong>70%</strong> 的推理请求，相比传统商业接口单月节约算力成本超过 <strong>¥42,000</strong>。
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Bottom: Recent Invocation Logs Stream -->
    <el-card shadow="never" class="!border-slate-200">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <el-icon class="text-emerald-600"><Monitor /></el-icon>
            <span class="font-semibold text-slate-800 text-sm">最新实时网关调用流水 (全链路审计日志)</span>
          </div>
          <el-button link type="primary" size="small" @click="store.currentView = 'monitoring'">
            查看完整日志审计 &rarr;
          </el-button>
        </div>
      </template>

      <el-table :data="store.logs.slice(0, 5)" stripe style="width: 100%" size="small">
        <el-table-column prop="id" label="Trace ID" width="170">
          <template #default="{ row }">
            <span class="font-mono text-xs text-indigo-600 font-medium">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="timestamp" label="请求时间" width="160">
          <template #default="{ row }">
            <span class="text-xs text-slate-500 font-mono">{{ row.timestamp }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="apiKeyName" label="调用方应用 / Key" min-width="160">
          <template #default="{ row }">
            <div class="truncate text-xs font-medium text-slate-800">{{ row.apiKeyName }}</div>
            <div class="text-[11px] text-slate-400 font-mono">{{ row.userName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="modelName" label="承接模型" width="190">
          <template #default="{ row }">
            <div class="truncate text-xs font-medium text-slate-700">{{ row.modelName }}</div>
            <div class="text-[11px] text-slate-400">{{ row.providerName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="statusCode" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.statusCode === 200 ? 'success' : 'danger'" size="small" effect="light">
              {{ row.statusCode }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="totalTokens" label="Tokens" width="110" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs text-slate-700">{{ row.totalTokens.toLocaleString() }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="latencyMs" label="时延" width="100" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs font-medium" :class="row.latencyMs < 500 ? 'text-emerald-600' : 'text-amber-600'">
              {{ row.latencyMs }} ms
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="costCny" label="核算费用" width="100" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs font-semibold text-slate-800">
              ¥{{ row.costCny.toFixed(4) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { store } from '../store/maasStore';
import {
  Cpu,
  Plus,
  Connection,
  ChatDotSquare,
  Key,
  Histogram,
  Money,
  DataLine,
  PieChart,
  Monitor,
  InfoFilled,
} from '@element-plus/icons-vue';

const totalModelsCount = computed(() => {
  return store.providers.reduce((acc, p) => acc + (p.models?.length || 0), 0);
});

const totalCallsFormatted = computed(() => {
  const sum = store.apiKeys.reduce((acc, k) => acc + k.totalCalls, 0);
  return sum.toLocaleString();
});

const totalTokens24hFormatted = computed(() => {
  const tokens = store.logs.reduce((acc, l) => acc + l.totalTokens, 0) * 140;
  return tokens.toLocaleString();
});

const avgLatency = computed(() => {
  if (!store.logs.length) return 0;
  const sum = store.logs.reduce((acc, l) => acc + l.latencyMs, 0);
  return Math.round(sum / store.logs.length);
});

const totalCostMonth = computed(() => {
  return store.apiKeys.reduce((acc, k) => acc + k.usedQuotaCny, 0);
});

const quotaUsagePercent = computed(() => {
  const totalLimit = store.apiKeys.reduce((acc, k) => acc + k.monthlyQuotaCny, 0);
  if (!totalLimit) return 0;
  return Math.round((totalCostMonth.value / totalLimit) * 100);
});
</script>
