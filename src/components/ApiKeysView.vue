<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">企业统一 API Key 网关分发</h2>
        <p class="text-xs text-slate-500 mt-1">
          为业务方及应用分配标准化 Bearer Token，支持按模型授权白名单、RPM/TPM 细粒度限流及月度软预算熔断控制
        </p>
      </div>

      <div class="flex items-center gap-3">
        <el-button type="info" plain :icon="Document" @click="showCodeModal = true">
          调用集成示例 (Python/Java/cURL)
        </el-button>
        <el-button type="primary" :icon="Plus" @click="openCreateKeyDialog">
          新建统一 API Key
        </el-button>
      </div>
    </div>

    <!-- API Keys Table -->
    <el-card shadow="never" class="!border-slate-200">
      <el-table :data="store.apiKeys" style="width: 100%">
        <el-table-column label="应用密钥名称 / 责任人" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <el-icon :size="16"><Key /></el-icon>
              </div>
              <div>
                <div class="font-semibold text-slate-800 text-sm">{{ row.name }}</div>
                <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{{ row.department }}</span>
                  <span>{{ row.userName }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="统一网关 Token (含一键复制)" min-width="210">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 select-all">
                {{ revealedKeys[row.id] ? row.fullKey : row.keyPrefix + '••••••••••••••••' }}
              </span>
              <el-button
                link
                type="primary"
                size="small"
                @click="revealedKeys[row.id] = !revealedKeys[row.id]"
              >
                {{ revealedKeys[row.id] ? '隐藏' : '显示' }}
              </el-button>
              <el-button
                link
                type="info"
                size="small"
                @click="copyToClipboard(row.fullKey)"
              >
                复制
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="授权可用模型" min-width="170">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-if="row.allowedModels.includes('*')"
                size="small"
                type="success"
                effect="plain"
              >
                全部模型通配 (*)
              </el-tag>
              <el-tag
                v-else
                v-for="m in row.allowedModels"
                :key="m"
                size="small"
                type="info"
                effect="plain"
              >
                {{ m }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="流控阈值 (RPM / TPM)" width="160">
          <template #default="{ row }">
            <div class="text-xs font-mono text-slate-700">
              <div>RPM: <span class="font-semibold text-slate-900">{{ row.rateLimitRpm }}</span> 次/分</div>
              <div class="text-slate-500">TPM: <span class="font-semibold text-slate-800">{{ (row.rateLimitTpm / 1000).toFixed(0) }}k</span>/分</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="当月预算额度消耗" width="180">
          <template #default="{ row }">
            <div class="space-y-1">
              <div class="flex justify-between text-xs">
                <span class="font-mono font-medium text-slate-800">¥{{ row.usedQuotaCny.toFixed(2) }}</span>
                <span class="font-mono text-slate-400">/ ¥{{ row.monthlyQuotaCny }}</span>
              </div>
              <el-progress
                :percentage="Math.min(100, Math.round((row.usedQuotaCny / row.monthlyQuotaCny) * 100))"
                :status="row.usedQuotaCny / row.monthlyQuotaCny > 0.8 ? 'warning' : ''"
                :stroke-width="6"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="disabled"
              size="small"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130" align="right">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-1">
              <el-button link type="warning" size="small" @click="regenerateToken(row)">
                重置
              </el-button>
              <el-button link type="danger" size="small" @click="deleteKey(row.id)">
                注销
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog: Create Key -->
    <el-dialog v-model="createDialogVisible" title="创建统一网关 API 密钥" width="560px">
      <el-form :model="keyForm" label-position="top">
        <el-form-item label="接入应用或系统名称" required>
          <el-input v-model="keyForm.name" placeholder="例如: 智能知识库检索问答 Copilot" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="核算业务部门" required>
              <el-select v-model="keyForm.department" style="width: 100%">
                <el-option label="软件研发中心" value="软件研发中心" />
                <el-option label="客户服务中心" value="客户服务中心" />
                <el-option label="财务管理部" value="财务管理部" />
                <el-option label="算法创新实验室" value="AI 创新实验室" />
                <el-option label="运营数据中心" value="运营数据中心" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度软预算上限 (CNY)" required>
              <el-input-number v-model="keyForm.monthlyQuotaCny" :min="100" :step="500" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="请求速率限制 (RPM)">
              <el-input-number v-model="keyForm.rateLimitRpm" :min="10" :step="100" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Token速率限制 (TPM)">
              <el-input-number v-model="keyForm.rateLimitTpm" :min="10000" :step="50000" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="授权允许调用的模型 (支持通配或细粒度勾选)">
          <el-select v-model="keyForm.allowedModels" multiple placeholder="默认包含全部模型" style="width: 100%">
            <el-option label="* 全部模型 (通配)" value="*" />
            <el-option label="DeepSeek-R1 (深度推理)" value="deepseek-r1" />
            <el-option label="DeepSeek-V3 (通用旗舰)" value="deepseek-v3" />
            <el-option label="GPT-4o (全能多模态)" value="gpt-4o" />
            <el-option label="OpenAI o1 (慢思考)" value="o1-preview" />
            <el-option label="Claude 3.5 Sonnet (代码王牌)" value="claude-3-5-sonnet" />
            <el-option label="通义千问 (Qwen-Max)" value="qwen-max" />
            <el-option label="Llama 3 70B (本地集群)" value="llama3-70b-local" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateKey">确认签发 Key</el-button>
      </template>
    </el-dialog>

    <!-- Dialog: Code Snippet -->
    <el-dialog v-model="showCodeModal" title="统一 API 密钥对接代码范式 (兼容 OpenAI SDK)" width="680px">
      <div class="text-xs text-slate-600 mb-3 leading-relaxed">
        客户端代码完全兼容 OpenAI 标准 SDK！只需将 <code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600">base_url</code> 指向统一网关服务地址，使用平台颁发的 Key，即可无缝透明调用任意国产与国际大模型。
      </div>

      <el-tabs v-model="activeCodeTab">
        <el-tab-pane label="Python (OpenAI SDK)" name="python">
          <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed"><code>from openai import OpenAI

# 1. 指向 MaaS Hub 统一网关 Java 服务入口
client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="maas-sk-live-02a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2"
)

# 2. 直接发起对话请求 (支持 deepseek-r1, gpt-4o, claude-3-5-sonnet 等)
response = client.chat.completions.create(
    model="deepseek-r1",
    messages=[
        {"role": "user", "content": "请分析微服务架构下的高并发限流算法"}
    ],
    temperature=0.6,
    stream=True
)

for chunk in response:
    content = chunk.choices[0].delta.content or ""
    print(content, end="", flush=True)</code></pre>
        </el-tab-pane>

        <el-tab-pane label="Node.js / TypeScript" name="nodejs">
          <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed"><code>import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:8080/v1',
  apiKey: 'maas-sk-live-02a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
});

async function main() {
  const stream = await client.chat.completions.create({
    model: 'deepseek-v3',
    messages: [{ role: 'user', content: '您好，请介绍一下企业 MaaS 治理' }],
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();</code></pre>
        </el-tab-pane>

        <el-tab-pane label="cURL / HTTP" name="curl">
          <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed"><code>curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer maas-sk-live-02a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2" \
  -d '{
    "model": "deepseek-r1",
    "messages": [{"role": "user", "content": "你好！"}],
    "stream": false
  }'</code></pre>
        </el-tab-pane>

        <el-tab-pane label="Java (Spring / OkHttp)" name="java">
          <pre class="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed"><code>OkHttpClient client = new OkHttpClient();
MediaType JSON = MediaType.get("application/json; charset=utf-8");

String jsonBody = "{\"model\":\"deepseek-r1\",\"messages\":[{\"role\":\"user\",\"content\":\"分析系统架构\"}]}";

Request request = new Request.Builder()
    .url("http://localhost:8080/v1/chat/completions")
    .addHeader("Authorization", "Bearer maas-sk-live-02a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2")
    .post(RequestBody.create(jsonBody, JSON))
    .build();

try (Response response = client.newCall(request).execute()) {
    System.out.println(response.body().string());
}</code></pre>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button type="primary" @click="showCodeModal = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { store } from '../store/maasStore';
import type { ApiKeyConfig } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Document, Key } from '@element-plus/icons-vue';

const revealedKeys = reactive<Record<string, boolean>>({});
const createDialogVisible = ref(false);
const showCodeModal = ref(false);
const activeCodeTab = ref('python');

const keyForm = reactive({
  name: '',
  department: '软件研发中心',
  monthlyQuotaCny: 5000,
  rateLimitRpm: 600,
  rateLimitTpm: 300000,
  allowedModels: ['*'],
});

function openCreateKeyDialog() {
  keyForm.name = '';
  keyForm.department = '软件研发中心';
  keyForm.monthlyQuotaCny = 5000;
  keyForm.rateLimitRpm = 600;
  keyForm.rateLimitTpm = 300000;
  keyForm.allowedModels = ['*'];
  createDialogVisible.value = true;
}

function submitCreateKey() {
  if (!keyForm.name) {
    ElMessage.warning('请输入接入应用或系统名称');
    return;
  }

  const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const prefix = 'maas-sk-live-' + (store.apiKeys.length + 1).toString().padStart(2, '0');
  const fullKey = `${prefix}${randomHex}`;

  store.apiKeys.unshift({
    id: 'key-' + Date.now(),
    name: keyForm.name,
    keyPrefix: prefix,
    fullKey: fullKey,
    userId: 'usr-001',
    userName: '平台管理员',
    department: keyForm.department,
    status: 'active',
    allowedModels: keyForm.allowedModels.length ? keyForm.allowedModels : ['*'],
    rateLimitRpm: keyForm.rateLimitRpm,
    rateLimitTpm: keyForm.rateLimitTpm,
    monthlyQuotaCny: keyForm.monthlyQuotaCny,
    usedQuotaCny: 0,
    totalCalls: 0,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    ipWhitelist: ['*'],
  });

  createDialogVisible.value = false;
  ElMessage.success(`API Key 签发成功！已生效至网关服务`);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  ElMessage.success('统一 API Key 已成功复制到剪贴板！');
}

function handleStatusChange(row: ApiKeyConfig) {
  ElMessage.info(`密钥【${row.name}】状态已变更为: ${row.status === 'active' ? '启用' : '禁用'}`);
}

function regenerateToken(row: ApiKeyConfig) {
  ElMessageBox.confirm(`确定要重置密钥【${row.name}】的 Token 吗？重置后旧 Token 将立即失效。`, '重要安全提示', {
    confirmButtonText: '确定重置',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    row.fullKey = `${row.keyPrefix}${randomHex}`;
    ElMessage.success('已生成新 Token，请及时同步至业务客户端');
  });
}

function deleteKey(id: string) {
  ElMessageBox.confirm('确定注销该 API Key 吗？', '确认', {
    confirmButtonText: '确定注销',
    cancelButtonText: '取消',
    type: 'error',
  }).then(() => {
    const idx = store.apiKeys.findIndex(k => k.id === id);
    if (idx !== -1) {
      store.apiKeys.splice(idx, 1);
      ElMessage.success('API Key 已在网关及数据库中软删除注销');
    }
  });
}
</script>
