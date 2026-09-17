<template>
  <div class="space-y-6">
    <!-- Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">大模型供应商与基础资产管理</h2>
        <p class="text-xs text-slate-500 mt-1">
          统一纳管公有云模型服务商及企业私有自建算力集群，支持协议动态适配与健康探测
        </p>
      </div>

      <div class="flex items-center gap-3">
        <el-button type="info" plain :icon="Refresh" @click="testAllProviders">
          全网健康度巡检
        </el-button>
        <el-button type="primary" :icon="Plus" @click="openAddDialog">
          新增模型供应商
        </el-button>
      </div>
    </div>

    <!-- Provider Cards / Table -->
    <el-card shadow="never" class="!border-slate-200">
      <el-table
        :data="store.providers"
        style="width: 100%"
        row-key="id"
        :expand-row-keys="['prov-deepseek']"
      >
        <!-- Expanded Row for Models List -->
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="p-4 bg-slate-50 rounded-lg mx-3 my-2 border border-slate-200">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <el-icon class="text-indigo-600"><Cpu /></el-icon>
                  {{ row.name }} 挂载的基础模型目录 ({{ row.models.length }})
                </span>
                <el-button size="small" type="primary" link @click="openAddModelDialog(row)">
                  + 添加模型资产
                </el-button>
              </div>

              <el-table :data="row.models" size="small" border style="width: 100%">
                <el-table-column prop="displayName" label="模型显示名" min-width="180">
                  <template #default="{ row: model }">
                    <div class="font-medium text-slate-800 text-xs">{{ model.displayName }}</div>
                    <div class="font-mono text-[11px] text-slate-400">{{ model.name }}</div>
                  </template>
                </el-table-column>

                <el-table-column prop="category" label="能力类型" width="110">
                  <template #default="{ row: model }">
                    <el-tag
                      size="small"
                      :type="model.category === 'reasoning' ? 'danger' : model.category === 'code' ? 'success' : model.category === 'vision' ? 'warning' : 'primary'"
                    >
                      {{ model.category === 'reasoning' ? '深度推理' : model.category === 'code' ? '代码构建' : model.category === 'vision' ? '多模态' : '通用对话' }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column prop="contextWindow" label="上下文上限" width="110" align="right">
                  <template #default="{ row: model }">
                    <span class="font-mono text-xs text-slate-700">
                      {{ (model.contextWindow / 1024).toFixed(0) }}K Tokens
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="计费单价 (元/100万Tokens)" width="200" align="right">
                  <template #default="{ row: model }">
                    <div class="text-xs font-mono">
                      <span class="text-slate-500">入: </span>¥{{ model.pricing.promptPerMillion }}
                      <span class="text-slate-300 mx-1">|</span>
                      <span class="text-slate-500">出: </span>¥{{ model.pricing.completionPerMillion }}
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="enabled" label="可用状态" width="90" align="center">
                  <template #default="{ row: model }">
                    <el-switch v-model="model.enabled" size="small" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>

        <!-- Main Table Columns -->
        <el-table-column label="供应商信息" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                <img :src="row.logoUrl" class="w-full h-full object-contain" :alt="row.name" />
              </div>
              <div>
                <div class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  {{ row.name }}
                  <el-tag v-if="row.isCustom" size="small" type="warning" effect="dark">自建集群</el-tag>
                </div>
                <div class="text-[11px] text-slate-500 truncate max-w-xs">{{ row.description }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="protocol" label="通信协议" width="150">
          <template #default="{ row }">
            <el-tag size="small" type="info" effect="plain" class="font-mono">
              {{ row.protocol }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="baseUrl" label="上游接入基地址" min-width="200">
          <template #default="{ row }">
            <span class="font-mono text-xs text-slate-600 truncate block max-w-xs" :title="row.baseUrl">
              {{ row.baseUrl }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="latencyMs" label="实测延迟" width="110" align="right">
          <template #default="{ row }">
            <span class="font-mono text-xs font-semibold" :class="row.latencyMs < 300 ? 'text-emerald-600' : 'text-amber-600'">
              {{ row.latencyMs }} ms
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="weight" label="调度权重" width="100" align="center">
          <template #default="{ row }">
            <span class="font-mono text-xs font-medium text-slate-700">{{ row.weight }}%</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small" effect="light">
              {{ row.status === 'active' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="right">
          <template #default="{ row }">
            <div class="flex items-center justify-end gap-2">
              <el-button
                size="small"
                type="primary"
                plain
                :loading="pingingId === row.id"
                @click="pingSingleProvider(row)"
              >
                测速
              </el-button>
              <el-button size="small" type="default" @click="openEditDialog(row)">
                配置
              </el-button>
              <el-button
                size="small"
                type="danger"
                link
                :disabled="row.id === 'prov-deepseek'"
                @click="deleteProvider(row.id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Dialog: Add / Edit Provider -->
    <el-dialog
      v-model="providerDialogVisible"
      :title="isEditing ? '编辑模型供应商配置' : '接入新大模型供应商'"
      width="620px"
      destroy-on-close
    >
      <el-form :model="providerForm" label-position="top" :rules="rules" ref="formRef">
        <el-row :gutter="16">
          <el-col :span="14">
            <el-form-item label="供应商显示名称" prop="name">
              <el-input v-model="providerForm.name" placeholder="例如: 智谱 AI (GLM-4)" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="唯一标识代码" prop="code">
              <el-input v-model="providerForm.code" placeholder="例如: zhipu" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="14">
            <el-form-item label="通信对接协议" prop="protocol">
              <el-select v-model="providerForm.protocol" style="width: 100%">
                <el-option label="OpenAI 兼容协议 (推荐)" value="openai-compatible" />
                <el-option label="Anthropic 协议" value="anthropic" />
                <el-option label="Gemini 原生协议" value="gemini" />
                <el-option label="Ollama 本地集群" value="ollama" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="多活路由权重 (1-100)" prop="weight">
              <el-input-number v-model="providerForm.weight" :min="1" :max="100" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="上游服务 Base URL" prop="baseUrl">
          <el-input v-model="providerForm.baseUrl" placeholder="https://open.bigmodel.cn/api/paas/v4" />
        </el-form-item>

        <el-form-item label="上游 API Key (将使用 AES-256 安全加密存储)" prop="apiKey">
          <el-input v-model="providerForm.apiKey" show-password placeholder="sk-..." />
        </el-form-item>

        <el-form-item label="集群属性">
          <el-checkbox v-model="providerForm.isCustom">企业内网自建算力节点 (Ollama / vLLM 纯离线环境)</el-checkbox>
        </el-form-item>

        <el-form-item label="服务说明与业务定位">
          <el-input
            v-model="providerForm.description"
            type="textarea"
            :rows="2"
            placeholder="说明该模型供应商的主攻场景，如代码生成、政企知识库、多模态问答等..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="providerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProvider">保存配置</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { store } from '../store/maasStore';
import type { Provider } from '../types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Refresh, Cpu } from '@element-plus/icons-vue';

const providerDialogVisible = ref(false);
const isEditing = ref(false);
const pingingId = ref<string | null>(null);

const providerForm = reactive({
  id: '',
  name: '',
  code: '',
  protocol: 'openai-compatible' as const,
  baseUrl: '',
  apiKey: '',
  weight: 90,
  isCustom: false,
  description: '',
});

const rules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入唯一代码', trigger: 'blur' }],
  baseUrl: [{ required: true, message: '请输入 Base URL', trigger: 'blur' }],
  apiKey: [{ required: true, message: '请输入 API Key', trigger: 'blur' }],
};

function openAddDialog() {
  isEditing.value = false;
  providerForm.id = 'prov-' + Date.now();
  providerForm.name = '';
  providerForm.code = '';
  providerForm.protocol = 'openai-compatible';
  providerForm.baseUrl = 'https://';
  providerForm.apiKey = '';
  providerForm.weight = 80;
  providerForm.isCustom = false;
  providerForm.description = '';
  providerDialogVisible.value = true;
}

function openEditDialog(row: Provider) {
  isEditing.value = true;
  providerForm.id = row.id;
  providerForm.name = row.name;
  providerForm.code = row.code;
  providerForm.protocol = row.protocol;
  providerForm.baseUrl = row.baseUrl;
  providerForm.apiKey = row.apiKey;
  providerForm.weight = row.weight;
  providerForm.isCustom = row.isCustom;
  providerForm.description = row.description;
  providerDialogVisible.value = true;
}

function submitProvider() {
  if (!providerForm.name || !providerForm.baseUrl) {
    ElMessage.warning('请填写完整的供应商必填项');
    return;
  }

  if (isEditing.value) {
    const idx = store.providers.findIndex(p => p.id === providerForm.id);
    if (idx !== -1) {
      store.providers[idx] = {
        ...store.providers[idx],
        name: providerForm.name,
        code: providerForm.code,
        protocol: providerForm.protocol,
        baseUrl: providerForm.baseUrl,
        apiKey: providerForm.apiKey,
        weight: providerForm.weight,
        isCustom: providerForm.isCustom,
        description: providerForm.description,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      };
      ElMessage.success('供应商配置已成功更新！');
    }
  } else {
    store.providers.push({
      id: providerForm.id,
      name: providerForm.name,
      code: providerForm.code,
      logoUrl: 'https://api.iconify.design/lucide:box.svg',
      protocol: providerForm.protocol,
      baseUrl: providerForm.baseUrl,
      apiKey: providerForm.apiKey,
      status: 'active',
      latencyMs: Math.floor(Math.random() * 200) + 150,
      errorRate: 0.001,
      weight: providerForm.weight,
      isCustom: providerForm.isCustom,
      description: providerForm.description,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      models: [
        {
          id: `${providerForm.code}-default`,
          name: `${providerForm.code}-chat`,
          displayName: `${providerForm.name} 默认通用模型`,
          providerId: providerForm.id,
          contextWindow: 65536,
          maxOutputTokens: 8192,
          pricing: { promptPerMillion: 2.0, completionPerMillion: 6.0 },
          enabled: true,
          category: 'chat',
        },
      ],
    });
    ElMessage.success('已成功新增模型供应商并完成路由注册！');
  }
  providerDialogVisible.value = false;
}

function pingSingleProvider(row: Provider) {
  pingingId.value = row.id;
  setTimeout(() => {
    row.latencyMs = Math.floor(Math.random() * 150) + (row.isCustom ? 45 : 160);
    row.status = 'active';
    pingingId.value = null;
    ElMessage.success(`【${row.name}】上游探测成功，往返时延: ${row.latencyMs}ms`);
  }, 600);
}

function testAllProviders() {
  ElMessage.info('正在发起全网大模型上游心跳巡检...');
  setTimeout(() => {
    store.providers.forEach(p => {
      p.latencyMs = Math.floor(Math.random() * 120) + (p.isCustom ? 40 : 150);
      p.status = 'active';
    });
    ElMessage.success('全网供应商链路通畅，状态已刷新！');
  }, 800);
}

function deleteProvider(id: string) {
  ElMessageBox.confirm('确定要移除该大模型供应商吗？移除后相关调用将触发自动熔断降级。', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    const idx = store.providers.findIndex(p => p.id === id);
    if (idx !== -1) {
      store.providers.splice(idx, 1);
      ElMessage.success('已安全移除该供应商配置');
    }
  });
}

function openAddModelDialog(row: Provider) {
  ElMessage.info(`请在平台资产管理中为【${row.name}】登记新模型目录`);
}
</script>
