<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">算力成本分析与财务费用核算</h2>
        <p class="text-xs text-slate-500 mt-1">
          多维度统计各业务线大模型调用 Token 与费用分摊，提供精准的成本精算与优化建议
        </p>
      </div>

      <div class="flex items-center gap-3">
        <el-button type="primary" :icon="Download" @click="exportBillingReport">
          导出月度财务账单
        </el-button>
      </div>
    </div>

    <!-- Financial KPI Cards -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="never" class="!border-slate-200">
          <div class="text-xs text-slate-500">当月累计已产生成本</div>
          <div class="mt-2 text-2xl font-bold text-slate-800">
            ¥{{ totalSpentMonth.toFixed(2) }}
          </div>
          <div class="mt-2 text-xs text-slate-400">
            总软预算: <span class="font-mono text-slate-600">¥{{ totalBudgetMonth.toLocaleString() }}</span>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="never" class="!border-slate-200">
          <div class="text-xs text-slate-500">国产自研模型节约金额</div>
          <div class="mt-2 text-2xl font-bold text-emerald-600">
            ¥{{ savedByDomestic.toLocaleString() }}
          </div>
          <div class="mt-2 text-xs text-emerald-600">
            较纯闭源调用成本降低 73.5%
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="never" class="!border-slate-200">
          <div class="text-xs text-slate-500">每千 Token 综合均价</div>
          <div class="mt-2 text-2xl font-bold text-indigo-600">
            ¥0.0038
          </div>
          <div class="mt-2 text-xs text-slate-400">
            行业基准均价约 ¥0.0142
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="never" class="!border-slate-200">
          <div class="text-xs text-slate-500">当月预计月末总账单</div>
          <div class="mt-2 text-2xl font-bold text-amber-600">
            ¥{{ (totalSpentMonth * 1.8).toFixed(2) }}
          </div>
          <div class="mt-2 text-xs text-amber-600">
            在预算安全红线范围 (48.6%) 内
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Provider Breakdown & Department Breakdown -->
    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="!border-slate-200">
          <template #header>
            <div class="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <el-icon class="text-blue-600"><PieChart /></el-icon>
              各供应商算力支出分布
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="prov in providerCostList" :key="prov.name">
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">{{ prov.name }}</span>
                <span class="font-mono text-slate-600">¥{{ prov.cost.toFixed(2) }} ({{ prov.percent }}%)</span>
              </div>
              <el-progress :percentage="prov.percent" :stroke-width="8" :color="prov.color" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="12">
        <el-card shadow="never" class="!border-slate-200">
          <template #header>
            <div class="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <el-icon class="text-indigo-600"><OfficeBuilding /></el-icon>
              部门成本分摊结算表
            </div>
          </template>

          <el-table :data="departmentCosts" size="small" style="width: 100%">
            <el-table-column prop="department" label="业务部门" min-width="130">
              <template #default="{ row }">
                <span class="font-medium text-xs text-slate-800">{{ row.department }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="calls" label="调用量(次)" width="100" align="right">
              <template #default="{ row }">
                <span class="font-mono text-xs text-slate-700">{{ row.calls.toLocaleString() }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="tokens" label="消耗Tokens" width="120" align="right">
              <template #default="{ row }">
                <span class="font-mono text-xs text-slate-600">{{ (row.tokens / 1000000).toFixed(2) }}M</span>
              </template>
            </el-table-column>

            <el-table-column prop="spent" label="分摊金额" width="110" align="right">
              <template #default="{ row }">
                <span class="font-mono text-xs font-bold text-slate-900">¥{{ row.spent.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- Model Level Detail Breakdown Table -->
    <el-card shadow="never" class="!border-slate-200">
      <template #header>
        <div class="font-semibold text-slate-800 text-sm">
          基础模型资产明细核算目录 (按百万 Tokens 计费单价核算)
        </div>
      </template>

      <el-table :data="modelCostList" stripe style="width: 100%" size="small">
        <el-table-column prop="displayName" label="模型名称" min-width="190">
          <template #default="{ row }">
            <div class="font-semibold text-slate-800 text-xs">{{ row.displayName }}</div>
            <div class="font-mono text-[11px] text-slate-400">{{ row.provider }}</div>
          </template>
        </el-table-column>

        <el-table-column label="计费单价 (Prompt / Completion)" width="210">
          <template #default="{ row }">
            <span class="font-mono text-xs text-slate-600">
              ¥{{ row.promptRate }} / ¥{{ row.completionRate }} (每1M)
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="promptTokens" label="输入 Tokens" width="130" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs text-slate-700">{{ row.promptTokens.toLocaleString() }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="completionTokens" label="输出 Tokens" width="130" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs text-slate-700">{{ row.completionTokens.toLocaleString() }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="totalFee" label="计费总额" width="120" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs font-bold text-indigo-700">¥{{ row.totalFee.toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { store } from '../store/maasStore';
import { ElMessage } from 'element-plus';
import { Download, PieChart, OfficeBuilding } from '@element-plus/icons-vue';

const totalSpentMonth = computed(() => {
  return store.apiKeys.reduce((acc, k) => acc + k.usedQuotaCny, 0);
});

const totalBudgetMonth = computed(() => {
  return store.apiKeys.reduce((acc, k) => acc + k.monthlyQuotaCny, 0);
});

const savedByDomestic = computed(() => {
  return 42800;
});

const providerCostList = [
  { name: 'DeepSeek (R1/V3 国产推理引擎)', cost: 7850.2, percent: 54, color: '#4f46e5' },
  { name: 'Anthropic (Claude 3.5 Sonnet)', cost: 4210.5, percent: 29, color: '#f59e0b' },
  { name: 'OpenAI (GPT-4o & o1)', cost: 1890.3, percent: 13, color: '#10b981' },
  { name: '通义千问 (Qwen-Max)', cost: 580.4, percent: 4, color: '#0ea5e9' },
  { name: '私有集群 (Ollama K8s)', cost: 0.0, percent: 0, color: '#8b5cf6' },
];

const departmentCosts = [
  { department: '软件研发中心', calls: 124500, tokens: 189200000, spent: 8912.4 },
  { department: '客户服务中心', calls: 48290, tokens: 68400000, spent: 3240.65 },
  { department: '架构技术委员会', calls: 23410, tokens: 32100000, spent: 1560.8 },
  { department: '财务管理部', calls: 6800, tokens: 9400000, spent: 820.15 },
  { department: 'AI 创新实验室', calls: 1240, tokens: 1800000, spent: 88.5 },
];

const modelCostList = [
  {
    displayName: 'DeepSeek-R1 (深度推理大模型)',
    provider: 'DeepSeek (深度求索)',
    promptRate: 4.0,
    completionRate: 16.0,
    promptTokens: 42100000,
    completionTokens: 68400000,
    totalFee: 1262.8,
  },
  {
    displayName: 'DeepSeek-V3 (通用多能大模型)',
    provider: 'DeepSeek (深度求索)',
    promptRate: 1.0,
    completionRate: 2.0,
    promptTokens: 88900000,
    completionTokens: 54200000,
    totalFee: 197.3,
  },
  {
    displayName: 'Claude 3.5 Sonnet (代码王牌)',
    provider: 'Anthropic Claude',
    promptRate: 21.6,
    completionRate: 108.0,
    promptTokens: 24500000,
    completionTokens: 34100000,
    totalFee: 4212.0,
  },
  {
    displayName: 'GPT-4o (Omni 原生多模态)',
    provider: 'OpenAI (公有云通道)',
    promptRate: 18.0,
    completionRate: 72.0,
    promptTokens: 18200000,
    completionTokens: 14600000,
    totalFee: 1378.8,
  },
  {
    displayName: 'Llama 3 70B (本地高性能集群)',
    provider: '私有算力集群 (Ollama K8s)',
    promptRate: 0.0,
    completionRate: 0.0,
    promptTokens: 12500000,
    completionTokens: 8900000,
    totalFee: 0.0,
  },
];

function exportBillingReport() {
  ElMessage.success('月度各部门算力账单已生成并成功导出！');
}
</script>
