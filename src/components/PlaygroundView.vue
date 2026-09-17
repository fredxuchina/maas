<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">在线模型推理沙箱 (Playground)</h2>
        <p class="text-xs text-slate-500 mt-1">
          直连统一网关验证模型响应质量、测试思维链推理深度 (CoT) 及核算单次 Token 与费用成本
        </p>
      </div>

      <div class="flex items-center gap-2">
        <el-tag type="success" effect="dark" size="small">网关直连: /v1/chat/completions</el-tag>
      </div>
    </div>

    <!-- Main Playground Workspace -->
    <el-row :gutter="16">
      <!-- Left Config Sidebar -->
      <el-col :xs="24" :lg="8">
        <el-card shadow="never" class="!border-slate-200">
          <template #header>
            <div class="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <el-icon class="text-indigo-600"><Setting /></el-icon>
              模型与推理超参配置
            </div>
          </template>

          <el-form label-position="top" size="small">
            <el-form-item label="目标调用模型">
              <el-select v-model="selectedModel" style="width: 100%" size="default">
                <el-option-group
                  v-for="prov in store.providers"
                  :key="prov.id"
                  :label="prov.name"
                >
                  <el-option
                    v-for="m in prov.models"
                    :key="m.id"
                    :label="m.displayName"
                    :value="m.id"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item label="鉴权身份 (统一 API Key)">
              <el-select v-model="selectedApiKeyId" style="width: 100%" size="default">
                <el-option
                  v-for="k in store.apiKeys"
                  :key="k.id"
                  :label="`${k.name} (${k.department})`"
                  :value="k.id"
                />
              </el-select>
            </el-form-item>

            <el-divider />

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-600">随机采样温度 (Temperature): {{ temperature }}</span>
                  <span class="font-mono text-slate-400">0.0 - 2.0</span>
                </div>
                <el-slider v-model="temperature" :min="0" :max="2" :step="0.1" />
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-600">最大生成长度 (Max Tokens): {{ maxTokens }}</span>
                  <span class="font-mono text-slate-400">256 - 8192</span>
                </div>
                <el-slider v-model="maxTokens" :min="256" :max="8192" :step="256" />
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-700 font-medium">启用流式传输 (Stream SSE)</span>
                <el-switch v-model="isStream" size="small" />
              </div>
            </div>

            <el-divider />

            <el-form-item label="系统预置设定 (System Prompt)">
              <el-input
                v-model="systemPrompt"
                type="textarea"
                :rows="3"
                placeholder="例如: 你是企业级技术架构专家，回答需精炼严谨，给出代码与架构推演..."
              />
            </el-form-item>

            <div>
              <div class="text-xs text-slate-500 mb-2 font-medium">快速测试预设场景:</div>
              <div class="flex flex-wrap gap-1.5">
                <el-button
                  v-for="preset in promptPresets"
                  :key="preset.title"
                  size="small"
                  type="info"
                  plain
                  @click="applyPreset(preset)"
                >
                  {{ preset.title }}
                </el-button>
              </div>
            </div>
          </el-form>
        </el-card>
      </el-col>

      <!-- Right Chat / Output Area -->
      <el-col :xs="24" :lg="16">
        <el-card shadow="never" class="!border-slate-200 flex flex-col h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <el-icon class="text-blue-600"><ChatDotSquare /></el-icon>
                <span class="font-semibold text-slate-800 text-sm">实时对话与思维链透视</span>
              </div>
              <div v-if="executionMetrics" class="flex items-center gap-3 text-xs font-mono">
                <span class="text-slate-500">时延: <strong class="text-emerald-600">{{ executionMetrics.latency }}ms</strong></span>
                <span class="text-slate-500">TTFT: <strong class="text-indigo-600">{{ executionMetrics.ttft }}ms</strong></span>
                <span class="text-slate-500">Tokens: <strong class="text-slate-800">{{ executionMetrics.tokens }}</strong></span>
                <span class="text-slate-500">费用: <strong class="text-amber-600">¥{{ executionMetrics.cost.toFixed(5) }}</strong></span>
              </div>
            </div>
          </template>

          <div class="space-y-4 flex-1 flex flex-col">
            <!-- Output Display Area -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
              <div v-if="!thinkingContent && !responseContent && !isLoading" class="h-full flex flex-col items-center justify-center text-slate-400 py-16">
                <el-icon :size="48" class="text-slate-300 mb-3"><Service /></el-icon>
                <p class="text-sm">在下方输入 Prompt 或点击左侧预设场景，立即体验大模型服务</p>
                <p class="text-xs text-slate-400 mt-1">支持 DeepSeek-R1 强化学习完整思维链展示</p>
              </div>

              <!-- CoT Thinking Chain Box -->
              <div v-if="thinkingContent" class="bg-indigo-950/90 text-indigo-100 rounded-lg p-4 border border-indigo-800 text-xs">
                <div class="flex items-center justify-between text-indigo-300 font-semibold mb-2">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                    DeepSeek-R1 深度思维链推演 (CoT):
                  </span>
                  <span class="font-mono text-[11px] text-indigo-400">强化学习思考过程</span>
                </div>
                <div class="whitespace-pre-wrap font-mono leading-relaxed text-indigo-200/90 max-h-56 overflow-y-auto">
                  {{ thinkingContent }}
                </div>
              </div>

              <!-- Main Assistant Response -->
              <div v-if="responseContent" class="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-800 leading-relaxed shadow-sm">
                <div class="flex items-center justify-between text-xs text-slate-400 pb-2 mb-3 border-b border-slate-100">
                  <span class="font-semibold text-slate-700">模型正式输出:</span>
                  <el-button link type="primary" size="small" @click="copyResponse">复制回复</el-button>
                </div>
                <div class="whitespace-pre-wrap font-sans leading-relaxed">
                  {{ responseContent }}
                </div>
              </div>

              <!-- Loading Skeleton / Spinner -->
              <div v-if="isLoading" class="flex items-center gap-3 p-4 text-xs text-indigo-600 bg-indigo-50/60 rounded-lg border border-indigo-100">
                <span class="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>正在通过 MaaS 统一网关转发请求至上游大模型服务并计量 Token...</span>
              </div>
            </div>

            <!-- Input Box -->
            <div class="pt-2">
              <el-input
                v-model="userPrompt"
                type="textarea"
                :rows="3"
                placeholder="请输入您的问题或指令 (Ctrl + Enter 快速发送)..."
                @keydown.ctrl.enter="sendRequest"
              />
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-slate-400 font-mono">
                  字符数: {{ userPrompt.length }}
                </span>
                <div class="flex items-center gap-2">
                  <el-button size="default" @click="clearChat">清空</el-button>
                  <el-button
                    type="primary"
                    size="default"
                    :loading="isLoading"
                    :icon="Promotion"
                    @click="sendRequest"
                  >
                    发送请求
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { store } from '../store/maasStore';
import { ElMessage } from 'element-plus';
import { Setting, ChatDotSquare, Service, Promotion } from '@element-plus/icons-vue';

const selectedModel = ref('deepseek-r1');
const selectedApiKeyId = ref('key-02');
const temperature = ref(0.6);
const maxTokens = ref(2048);
const isStream = ref(true);
const systemPrompt = ref('你是由企业 MaaS 统一网关调度的专家级智能助手，逻辑严密，技术解答深刻全面。');
const userPrompt = ref('');

const isLoading = ref(false);
const thinkingContent = ref('');
const responseContent = ref('');
const executionMetrics = ref<{ latency: number; ttft: number; tokens: number; cost: number } | null>(null);

const promptPresets = [
  {
    title: '高并发限流推演',
    prompt: '请分析在 Java Spring Boot 3 网关架构下，如何设计基于 Redis + Lua 脚本的高性能分布式令牌桶限流算法？',
  },
  {
    title: 'Vue 3 组件重构',
    prompt: '将一段旧版 Options API 代码重构成 Vue 3 Composition API + Element Plus，并写明核心响应式原理区别。',
  },
  {
    title: '企业大模型选型',
    prompt: '从推理性能、参数规模、开源协议与算力成本四个维度，对比 DeepSeek-R1 与主流海外闭源模型优劣。',
  },
];

function applyPreset(preset: { title: string; prompt: string }) {
  userPrompt.value = preset.prompt;
  sendRequest();
}

function clearChat() {
  userPrompt.value = '';
  thinkingContent.value = '';
  responseContent.value = '';
  executionMetrics.value = null;
}

function copyResponse() {
  navigator.clipboard.writeText(responseContent.value);
  ElMessage.success('模型响应内容已成功复制！');
}

function sendRequest() {
  if (!userPrompt.value.trim()) {
    ElMessage.warning('请输入 Prompt 提示词');
    return;
  }

  isLoading.value = true;
  thinkingContent.value = '';
  responseContent.value = '';
  executionMetrics.value = null;

  const isReasoning = selectedModel.value === 'deepseek-r1' || selectedModel.value === 'o1-preview';
  const startTime = performance.now();

  // Simulate stream tokens and thinking chain
  setTimeout(() => {
    if (isReasoning) {
      thinkingContent.value = `[思维链推演阶段 - DeepSeek-R1 CoT]\n1. 解析输入指令：“${userPrompt.value.slice(0, 35)}...”\n2. 识别核心技术点：架构模式、分布式并发锁、高可用与弹性容灾。\n3. 推导方案：\n   - 选用 Redis Hash 或 ZSet 实现滑动窗口；\n   - 结合 Spring Cloud Gateway 全局过滤器实现统一拦截；\n   - 引入动态配置中心实现热更新阈值而不必重启网关。\n4. 形成系统化输出并校验边界条件...`;
    }

    setTimeout(() => {
      responseContent.value = `### 深度解答分析\n\n基于您的提问，在企业级大模型即服务统一网关中，推荐的落地架构如下：\n\n1. **多级缓冲与限流机制**：\n   - **前置网关层 (Spring Boot 3 + OkHttp)**：校验 Token 合法性、RPM/TPM 计数器；\n   - **流量调度层**：结合各上游供应商实时心跳延迟与预设权重实现加权负载均衡；\n   - **流式中继 (SSE)**：全链路透传下游客户端，保持极低首字时延 (TTFT < 300ms)。\n\n2. **持久化与审计**：\n   - 异步解耦写入 MySQL \`gateway_invocation_log\` 表，确保主转发流程无性能阻塞；\n   - 结合日级汇总表按部门和模型精细化分摊算力开销。\n\n如需进一步结合具体业务场景调整超参数，请随时沟通！`;

      const elapsed = Math.round(performance.now() - startTime + 380);
      const promptToks = Math.round(userPrompt.value.length * 1.5 + 40);
      const completionToks = 320;
      const totalToks = promptToks + completionToks;
      const cost = isReasoning ? (promptToks * 4 + completionToks * 16) / 1000000 : 0.0012;

      executionMetrics.value = {
        latency: elapsed,
        ttft: isReasoning ? 280 : 90,
        tokens: totalToks,
        cost: cost,
      };

      // Add to store invocation logs
      store.logs.unshift({
        id: 'tr-' + Date.now().toString().slice(-8),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        apiKeyId: selectedApiKeyId.value,
        apiKeyName: store.apiKeys.find(k => k.id === selectedApiKeyId.value)?.name || '默认测试 Key',
        userId: 'usr-001',
        userName: '平台总架构师',
        providerId: 'prov-deepseek',
        providerName: 'DeepSeek (深度求索)',
        modelId: selectedModel.value,
        modelName: selectedModel.value,
        promptTokens: promptToks,
        completionTokens: completionToks,
        totalTokens: totalToks,
        promptSnippet: userPrompt.value,
        responseSnippet: (thinkingContent.value ? `<think>${thinkingContent.value}</think>` : '') + responseContent.value,
        latencyMs: elapsed,
        ttftMs: isReasoning ? 280 : 90,
        statusCode: 200,
        costCny: cost,
        ipAddress: '127.0.0.1 (沙箱)',
      });

      isLoading.value = false;
      ElMessage.success('推理完成！已自动记录调用审计日志');
    }, 800);
  }, 400);
}
</script>
