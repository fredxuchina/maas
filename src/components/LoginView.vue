<template>
  <div class="min-h-screen w-full flex bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full flex flex-col lg:flex-row z-10">
      <!-- Left Showcase Panel -->
      <div class="hidden lg:flex lg:w-7/12 p-12 flex-col justify-between border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative">
        <!-- Brand Header -->
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <el-icon :size="24" class="text-white"><Cpu /></el-icon>
          </div>
          <div>
            <div class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              MaaS Hub
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Enterprise</span>
            </div>
            <div class="text-xs text-slate-400">企业级大模型即服务(MaaS)统一治理调度平台</div>
          </div>
        </div>

        <!-- Center Showcase -->
        <div class="space-y-8 my-auto max-w-xl">
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              企业级统一算力调度与智能网关内核
            </div>
            <h1 class="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              打通异构大模型壁垒，<br />
              实现<span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">全链路网关治理与精细成本核算</span>
            </h1>
            <p class="text-sm text-slate-400 leading-relaxed">
              集中编排 DeepSeek、OpenAI、Claude、通义千问及私有化 Ollama 集群，提供标准化 OpenAI 协议中转、多租户 API Key 配额管控、毫秒级调用审计与多维财务算力分析。
            </p>
          </div>

          <!-- Feature Bullets Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5">
                <el-icon :size="18"><Connection /></el-icon>
              </div>
              <div class="text-sm font-semibold text-slate-200">多模型协议统一</div>
              <div class="text-xs text-slate-400 mt-1 leading-normal">
                标准 OpenAI 格式接口透传，无缝兼容主流应用与 Agent 框架
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <el-icon :size="18"><Lock /></el-icon>
              </div>
              <div class="text-sm font-semibold text-slate-200">API 密钥统一管控</div>
              <div class="text-xs text-slate-400 mt-1 leading-normal">
                RPM/TPM 双流控，IP 白名单与部门级月度算力配额防超支
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5">
                <el-icon :size="18"><Monitor /></el-icon>
              </div>
              <div class="text-sm font-semibold text-slate-200">高精细度调用审计</div>
              <div class="text-xs text-slate-400 mt-1 leading-normal">
                精确记录 Token 消耗、TTFT 首字延迟、状态码与上下文 Snippet
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-2.5">
                <el-icon :size="18"><Coin /></el-icon>
              </div>
              <div class="text-sm font-semibold text-slate-200">多维费用精算归因</div>
              <div class="text-xs text-slate-400 mt-1 leading-normal">
                按部门、模型、供应商核算 CNY 账单，提供 ROI 与降本优化建议
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Tag -->
        <div class="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-4">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 统一网关状态: 正常运行
            </span>
            <span>·</span>
            <span>安全合规中继</span>
          </div>
          <div class="font-mono text-[11px]">v2.4.0-RELEASE</div>
        </div>
      </div>

      <!-- Right Login Card Panel -->
      <div class="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-slate-950">
        <!-- Top navigation help -->
        <div class="flex items-center justify-between">
          <div class="lg:hidden flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <el-icon :size="18" class="text-white"><Cpu /></el-icon>
            </div>
            <span class="font-bold text-white text-base">MaaS Hub</span>
          </div>
          <div class="ml-auto">
            <el-button
              v-if="store.isLoggedIn"
              text
              class="!text-indigo-400 hover:!text-indigo-300"
              @click="backToDashboard"
            >
              <el-icon class="mr-1"><ArrowLeft /></el-icon> 返回控制台
            </el-button>
          </div>
        </div>

        <!-- Center Login Box -->
        <div class="max-w-md w-full mx-auto my-auto py-8">
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-white tracking-tight">欢迎登录 MaaS 治理平台</h2>
            <p class="text-xs text-slate-400 mt-1.5">
              请输入企业账号与密码，或通过下方的角色快捷通道一键免密体验
            </p>
          </div>

          <!-- Login Tabs -->
          <el-tabs v-model="activeTab" class="maas-login-tabs mb-6">
            <el-tab-pane label="账号密码登录" name="account">
              <el-form
                :model="loginForm"
                @submit.prevent="handleLogin"
                class="space-y-4 pt-2"
              >
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1.5">登录账号 (Username / Email)</label>
                  <el-input
                    v-model="loginForm.username"
                    placeholder="输入用户名，如 admin / developer / finance"
                    size="large"
                    clearable
                    class="maas-dark-input"
                  >
                    <template #prefix>
                      <el-icon class="text-slate-400"><User /></el-icon>
                    </template>
                  </el-input>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-xs font-medium text-slate-300">安全登录密码</label>
                    <button
                      type="button"
                      @click="showForgotModal = true"
                      class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      忘记密码？
                    </button>
                  </div>
                  <el-input
                    v-model="loginForm.password"
                    type="password"
                    show-password
                    placeholder="输入账号密码 (默认: password123)"
                    size="large"
                    class="maas-dark-input"
                    @keyup.enter="handleLogin"
                  >
                    <template #prefix>
                      <el-icon class="text-slate-400"><Lock /></el-icon>
                    </template>
                  </el-input>
                </div>

                <!-- Verification Code -->
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1.5">图形防刷验证码</label>
                  <div class="flex items-center gap-3">
                    <el-input
                      v-model="loginForm.captcha"
                      placeholder="输入验证码"
                      size="large"
                      maxlength="4"
                      class="maas-dark-input flex-1"
                      @keyup.enter="handleLogin"
                    >
                      <template #prefix>
                        <el-icon class="text-slate-400"><Key /></el-icon>
                      </template>
                    </el-input>

                    <div
                      @click="refreshCaptcha"
                      class="h-10 px-4 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer select-none tracking-widest font-mono text-base font-bold text-indigo-300 hover:border-indigo-500 transition-colors shadow-inner"
                      title="点击刷新验证码"
                    >
                      {{ currentCaptcha }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <el-checkbox v-model="loginForm.remember" class="!text-slate-400 !text-xs">
                    7天内自动记住登录状态
                  </el-checkbox>
                </div>

                <el-button
                  type="primary"
                  size="large"
                  class="w-full !bg-indigo-600 !border-indigo-600 hover:!bg-indigo-500 !text-white !font-semibold !h-11 shadow-lg shadow-indigo-600/30"
                  :loading="isLoading"
                  @click="handleLogin"
                >
                  <el-icon v-if="!isLoading" class="mr-1.5"><Right /></el-icon>
                  <span>立即登录 MaaS 治理平台</span>
                </el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="演示快捷通道" name="fastpass">
              <div class="space-y-3 pt-2">
                <div class="text-xs text-slate-400 mb-3">
                  点击以下任意预设角色卡片，一键以该角色身份秒登入系统：
                </div>

                <!-- Admin Card -->
                <div
                  @click="quickLogin('admin')"
                  class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800/80 cursor-pointer transition-all group flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                      <el-icon :size="20"><Setting /></el-icon>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        超级管理员 (Admin)
                      </div>
                      <div class="text-xs text-slate-400">账号: admin · 角色: 系统总架构师</div>
                    </div>
                  </div>
                  <el-tag type="danger" size="small" effect="dark">最高权限</el-tag>
                </div>

                <!-- Developer Card -->
                <div
                  @click="quickLogin('developer')"
                  class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/80 cursor-pointer transition-all group flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <el-icon :size="20"><Cpu /></el-icon>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        算法与研发 (Developer)
                      </div>
                      <div class="text-xs text-slate-400">账号: developer · 角色: 智能算法工程师</div>
                    </div>
                  </div>
                  <el-tag type="success" size="small" effect="dark">研发沙箱</el-tag>
                </div>

                <!-- Finance Card -->
                <div
                  @click="quickLogin('finance')"
                  class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/80 cursor-pointer transition-all group flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <el-icon :size="20"><Coin /></el-icon>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        财务与审计 (Finance)
                      </div>
                      <div class="text-xs text-slate-400">账号: finance · 角色: 财务精算审计总监</div>
                    </div>
                  </div>
                  <el-tag type="warning" size="small" effect="dark">财务账单</el-tag>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- System info snippet -->
          <div class="mt-8 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <el-icon class="text-indigo-400"><InfoFilled /></el-icon>
              <span>内置多角色 RBAC 权限联动</span>
            </span>
            <span class="text-slate-500">演示密码统一为: password123</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-slate-500 pt-6 border-t border-slate-800/40">
          <span>企业级大模型即服务(MaaS)治理平台 · 内部核心系统</span>
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <el-dialog
      v-model="showForgotModal"
      title="找回或重置登录密码"
      width="440px"
      destroy-on-close
    >
      <div class="space-y-3 text-xs text-slate-600 leading-relaxed">
        <p>
          作为企业级内部 MaaS 治理平台，出于数据资产安全考量，普通账号不提供开放式自主找回通道。
        </p>
        <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 space-y-1">
          <div class="font-semibold flex items-center gap-1">
            <el-icon><Service /></el-icon> 重置密码处理指引：
          </div>
          <div>1. 请联系<strong>平台超级管理员 (admin@maas-enterprise.com)</strong>。</div>
          <div>2. 超级管理员可在后台的【用户与账号权限管理】页面点击<strong>“重置密码”</strong>为您一键生成或更新新密码。</div>
          <div>3. 演示环境下，所有初始账号密码均默认为：<code class="bg-indigo-200/80 px-1 py-0.5 rounded text-indigo-800 font-mono font-bold">password123</code>。</div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showForgotModal = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Cpu,
  User,
  Lock,
  Key,
  Right,
  Setting,
  Connection,
  Monitor,
  Coin,
  InfoFilled,
  Service,
  ArrowLeft,
} from '@element-plus/icons-vue';
import { store, loginUser } from '../store/maasStore';

const activeTab = ref('account');
const isLoading = ref(false);
const showForgotModal = ref(false);

const loginForm = reactive({
  username: 'admin',
  password: 'password123',
  captcha: '',
  remember: true,
});

const currentCaptcha = ref('8848');

function refreshCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let res = '';
  for (let i = 0; i < 4; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptcha.value = res;
}

onMounted(() => {
  refreshCaptcha();
});

function handleLogin() {
  if (!loginForm.username.trim()) {
    ElMessage.warning('请输入登录账号！');
    return;
  }
  if (!loginForm.password) {
    ElMessage.warning('请输入登录密码！');
    return;
  }
  if (loginForm.captcha && loginForm.captcha.toUpperCase() !== currentCaptcha.value.toUpperCase()) {
    ElMessage.error('验证码输入有误，请核对！');
    refreshCaptcha();
    return;
  }

  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    const res = loginUser(loginForm.username, loginForm.password);
    if (res.success) {
      ElMessage.success(res.message);
    } else {
      ElMessage.error(res.message);
      refreshCaptcha();
    }
  }, 400);
}

function quickLogin(role: 'admin' | 'developer' | 'finance') {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    const res = loginUser(role, 'password123');
    if (res.success) {
      ElMessage.success(`以【${res.user?.name}】身份快捷登录成功！`);
    } else {
      ElMessage.error(res.message);
    }
  }, 300);
}

function backToDashboard() {
  store.currentView = 'overview';
}
</script>

<style scoped>
:deep(.maas-login-tabs .el-tabs__item) {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

:deep(.maas-login-tabs .el-tabs__item.is-active) {
  color: #818cf8;
  font-weight: 600;
}

:deep(.maas-login-tabs .el-tabs__active-bar) {
  background-color: #6366f1;
}

:deep(.maas-dark-input .el-input__wrapper) {
  background-color: #0f172a;
  box-shadow: 0 0 0 1px #1e293b inset;
}

:deep(.maas-dark-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #6366f1 inset !important;
}

:deep(.maas-dark-input .el-input__inner) {
  color: #f8fafc;
}
</style>
