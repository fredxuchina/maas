<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">细粒度调用监控与审计链路</h2>
        <p class="text-xs text-slate-500 mt-1">
          毫秒级捕获全网网关推理请求，实时记录 Prompt/Completion Tokens、首字时延 TTFT 及单次核算成本
        </p>
      </div>

      <div class="flex items-center gap-3">
        <el-button type="success" plain :icon="Download" @click="exportCsv">
          导出审计 CSV
        </el-button>
        <el-button type="primary" plain :icon="Refresh" @click="refreshLogs">
          刷新流水
        </el-button>
      </div>
    </div>

    <!-- Filter Bar -->
    <el-card shadow="never" class="!border-slate-200">
      <el-row :gutter="12" class="items-center">
        <el-col :xs="24" :sm="12" :md="5">
          <el-select v-model="filterProvider" placeholder="全部供应商" clearable style="width: 100%" size="default">
            <el-option label="全部供应商" value="" />
            <el-option
              v-for="p in store.providers"
              :key="p.id"
              :label="p.name"
              :value="p.id"
            />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="12" :md="5">
          <el-select v-model="filterStatus" placeholder="状态码" clearable style="width: 100%" size="default">
            <el-option label="全部状态 (200/429/500)" value="" />
            <el-option label="200 OK (成功)" value="200" />
            <el-option label="429 Too Many Requests (限流)" value="429" />
            <el-option label="500 Internal Error (错误)" value="500" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="filterApiKey" placeholder="关联 API Key" clearable style="width: 100%" size="default">
            <el-option label="全部 API Key" value="" />
            <el-option
              v-for="k in store.apiKeys"
              :key="k.id"
              :label="k.name"
              :value="k.id"
            />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :md="8">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索 Trace ID、用户、提示词文本..."
            clearable
            :prefix-icon="Search"
            style="width: 100%"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- Logs Table -->
    <el-card shadow="never" class="!border-slate-200">
      <el-table
        :data="filteredLogs"
        stripe
        style="width: 100%"
        @row-click="showDetail"
        row-class-name="cursor-pointer"
      >
        <el-table-column prop="id" label="Trace ID" width="180">
          <template #default="{ row }">
            <span class="font-mono text-xs text-indigo-600 font-semibold hover:underline">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="timestamp" label="请求时间" width="160">
          <template #default="{ row }">
            <span class="text-xs text-slate-500 font-mono">{{ row.timestamp }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="apiKeyName" label="调用应用 / Key" min-width="160">
          <template #default="{ row }">
            <div class="truncate text-xs font-medium text-slate-800">{{ row.apiKeyName }}</div>
            <div class="text-[11px] text-slate-400 font-mono">{{ row.userName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="modelName" label="承接模型 / 供应商" min-width="180">
          <template #default="{ row }">
            <div class="truncate text-xs font-semibold text-slate-700">{{ row.modelName }}</div>
            <div class="text-[11px] text-slate-400">{{ row.providerName }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="statusCode" label="状态码" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              size="small"
              :type="row.statusCode === 200 ? 'success' : row.statusCode === 429 ? 'warning' : 'danger'"
              effect="light"
            >
              {{ row.statusCode }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Token 消耗 (入 / 出)" width="150" align="right">
          <template #default="{ row }">
            <div class="text-xs font-mono">
              <span class="text-slate-800 font-semibold">{{ row.totalTokens }}</span>
              <span class="text-[11px] text-slate-400 block">({{ row.promptTokens }} / {{ row.completionTokens }})</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="耗时 / TTFT" width="120" align="right">
          <template #default="{ row }">
            <div class="text-xs font-mono">
              <span class="font-medium" :class="row.latencyMs < 500 ? 'text-emerald-600' : 'text-amber-600'">
                {{ row.latencyMs }} ms
              </span>
              <span class="text-[11px] text-slate-400 block">TTFT {{ row.ttftMs }}ms</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="costCny" label="核算费用" width="110" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs font-bold text-slate-800">
              ¥{{ row.costCny.toFixed(4) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click.stop="showDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="网关链路调用细粒度审计详情"
      size="540px"
      destroy-on-close
    >
      <div v-if="selectedLog" class="space-y-5 text-sm">
        <!-- Key Attributes Table -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Trace ID:</span>
            <span class="font-mono text-indigo-600 font-bold">{{ selectedLog.id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">请求时间:</span>
            <span class="font-mono text-slate-700">{{ selectedLog.timestamp }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">客户端 IP:</span>
            <span class="font-mono text-slate-700">{{ selectedLog.ipAddress }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">承接供应商与模型:</span>
            <span class="font-medium text-slate-800">{{ selectedLog.modelName }} ({{ selectedLog.providerName }})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">HTTP 状态:</span>
            <el-tag :type="selectedLog.statusCode === 200 ? 'success' : 'danger'" size="small">
              {{ selectedLog.statusCode }}
            </el-tag>
          </div>
        </div>

        <!-- Token & Cost Formula Breakdown -->
        <div class="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 text-xs space-y-2">
          <div class="font-semibold text-indigo-900 flex items-center justify-between">
            <span>算力 Token 统计与计费公式拆解</span>
            <span class="text-indigo-600 font-mono text-sm font-bold">¥{{ selectedLog.costCny.toFixed(5) }}</span>
          </div>
          <div class="grid grid-cols-3 gap-2 py-2 border-y border-indigo-200/60 text-center font-mono">
            <div>
              <div class="text-slate-500 text-[11px]">Prompt Tokens</div>
              <div class="font-bold text-slate-800 text-sm">{{ selectedLog.promptTokens }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">Completion Tokens</div>
              <div class="font-bold text-slate-800 text-sm">{{ selectedLog.completionTokens }}</div>
            </div>
            <div>
              <div class="text-slate-500 text-[11px]">总计 Tokens</div>
              <div class="font-bold text-indigo-700 text-sm">{{ selectedLog.totalTokens }}</div>
            </div>
          </div>
          <div class="text-indigo-800/80 text-[11px] leading-relaxed">
            费用核算逻辑: <code class="font-mono">费用 = (PromptTokens × 输入单价/1M) + (CompletionTokens × 输出单价/1M)</code>
          </div>
        </div>

        <!-- Prompt Snippet -->
        <div>
          <div class="font-semibold text-slate-800 mb-1.5 flex items-center justify-between text-xs">
            <span>请求 Prompt 输入</span>
            <el-button link type="primary" size="small" @click="copyText(selectedLog.promptSnippet)">复制</el-button>
          </div>
          <div class="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono max-h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {{ selectedLog.promptSnippet }}
          </div>
        </div>

        <!-- Response Snippet / CoT -->
        <div>
          <div class="font-semibold text-slate-800 mb-1.5 flex items-center justify-between text-xs">
            <span>模型输出与思考链 (CoT)</span>
            <el-button link type="primary" size="small" @click="copyText(selectedLog.responseSnippet)">复制</el-button>
          </div>
          <div class="bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-lg text-xs max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap font-sans">
            {{ selectedLog.responseSnippet || (selectedLog.errorMessage ? '错误: ' + selectedLog.errorMessage : '无响应内容') }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { store } from '../store/maasStore';
import type { InvocationLog } from '../types';
import { ElMessage } from 'element-plus';
import { Download, Refresh, Search } from '@element-plus/icons-vue';

const filterProvider = ref('');
const filterStatus = ref('');
const filterApiKey = ref('');
const searchKeyword = ref('');

const drawerVisible = ref(false);
const selectedLog = ref<InvocationLog | null>(null);

const filteredLogs = computed(() => {
  return store.logs.filter(log => {
    if (filterProvider.value && log.providerId !== filterProvider.value) return false;
    if (filterStatus.value && log.statusCode.toString() !== filterStatus.value) return false;
    if (filterApiKey.value && log.apiKeyId !== filterApiKey.value) return false;
    if (searchKeyword.value) {
      const q = searchKeyword.value.toLowerCase();
      const match =
        log.id.toLowerCase().includes(q) ||
        log.promptSnippet.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.modelName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
});

function showDetail(row: InvocationLog) {
  selectedLog.value = row;
  drawerVisible.value = true;
}

function refreshLogs() {
  ElMessage.success('已拉取最新网关审计日志流水');
}

function copyText(text: string) {
  navigator.clipboard.writeText(text);
  ElMessage.success('文本已复制到剪贴板');
}

function exportCsv() {
  const headers = ['Trace ID', '时间', '应用Key', '用户', '供应商', '模型', '输入Token', '输出Token', '总Token', '延迟(ms)', '首字时延(ms)', '状态码', '费用(元)'];
  const rows = filteredLogs.value.map(l => [
    l.id,
    l.timestamp,
    `"${l.apiKeyName}"`,
    `"${l.userName}"`,
    `"${l.providerName}"`,
    `"${l.modelName}"`,
    l.promptTokens,
    l.completionTokens,
    l.totalTokens,
    l.latencyMs,
    l.ttftMs,
    l.statusCode,
    l.costCny.toFixed(5),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `maas_invocation_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  ElMessage.success('已成功导出全量 CSV 审计报表！');
}
</script>
