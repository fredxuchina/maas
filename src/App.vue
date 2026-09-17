<template>
  <!-- Dedicated Full-screen Login Interface -->
  <div v-if="!store.isLoggedIn || store.currentView === 'login'" class="min-h-screen w-full">
    <LoginView />
  </div>

  <!-- Authenticated MaaS Platform Dashboard Layout -->
  <el-container v-else class="min-h-screen bg-slate-100 font-sans text-slate-800">
    <!-- Left Sidebar -->
    <el-aside :width="isCollapse ? '64px' : '250px'" class="bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 select-none">
      <!-- Top Logo, Title & Collapse Toggle Button -->
      <div
        class="h-16 flex items-center border-b border-slate-800/80 bg-slate-950/40 shrink-0 transition-all duration-300"
        :class="isCollapse ? 'justify-center px-2' : 'justify-between px-3.5'"
      >
        <!-- Expanded Branding -->
        <div v-if="!isCollapse" class="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
            M
          </div>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-white text-sm tracking-wide truncate">MaaS Hub</div>
            <div class="text-[10px] text-slate-400 truncate">大模型服务治理与网关</div>
          </div>
        </div>

        <!-- Collapse / Expand Toggle Button at Top -->
        <el-tooltip
          :content="isCollapse ? '展开菜单栏' : '折叠菜单栏'"
          placement="right"
          :show-after="200"
        >
          <button
            @click="isCollapse = !isCollapse"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all flex items-center justify-center focus:outline-none"
            :class="isCollapse ? 'w-10 h-10 bg-slate-800/50 text-indigo-300' : ''"
            :aria-label="isCollapse ? '展开菜单栏' : '折叠菜单栏'"
          >
            <el-icon :size="17">
              <component :is="isCollapse ? Expand : Fold" />
            </el-icon>
          </button>
        </el-tooltip>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 py-3 overflow-y-auto">
        <el-menu
          :default-active="store.currentView"
          class="!border-r-0 !bg-transparent"
          :collapse="isCollapse"
          background-color="#0f172a"
          text-color="#94a3b8"
          active-text-color="#ffffff"
          @select="handleMenuSelect"
        >
          <el-menu-item index="overview">
            <el-icon><Odometer /></el-icon>
            <template #title>治理运行大盘</template>
          </el-menu-item>

          <el-menu-item index="providers">
            <el-icon><Connection /></el-icon>
            <template #title>大模型供应商</template>
          </el-menu-item>

          <el-menu-item index="apikeys">
            <el-icon><Key /></el-icon>
            <template #title>统一 API Key</template>
          </el-menu-item>

          <el-menu-item index="monitoring">
            <el-icon><Monitor /></el-icon>
            <template #title>调用链路审计</template>
          </el-menu-item>

          <el-menu-item index="billing">
            <el-icon><Money /></el-icon>
            <template #title>费用与成本核算</template>
          </el-menu-item>

          <el-menu-item index="playground">
            <el-icon><ChatDotSquare /></el-icon>
            <template #title>在线模型沙箱</template>
          </el-menu-item>

          <el-menu-item index="users">
            <el-icon><UserFilled /></el-icon>
            <template #title>
              <div class="flex items-center justify-between w-full pr-2">
                <span>用户与账号管理</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  {{ store.users.length }}
                </span>
              </div>
            </template>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- Quick Logout or View Login Screen Item -->
      <div class="p-3 border-t border-slate-800/60 bg-slate-950/20 shrink-0">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all text-left"
          :class="isCollapse ? 'justify-center !px-0' : ''"
          :title="isCollapse ? '退出 / 登录界面' : ''"
        >
          <el-icon :size="15"><SwitchButton /></el-icon>
          <span v-if="!isCollapse">退出 / 登录界面</span>
        </button>
      </div>
    </el-aside>

    <!-- Right Main Layout -->
    <el-container class="flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header -->
      <el-header class="!h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0">
        <!-- Breadcrumb / Title -->
        <div class="flex items-center gap-3">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>MaaS 平台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentViewTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- Right Controls: Role Switcher & User Profile -->
        <div class="flex items-center gap-4">
          <!-- Role Switcher Dropdown -->
          <div class="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span>当前权限视角:</span>
            <el-dropdown trigger="click" @command="handleRoleChange">
              <el-button size="small" type="primary" plain class="!font-medium">
                {{ currentRoleLabel }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="admin">
                    <div class="py-1">
                      <div class="font-bold text-slate-800">系统总架构师 (admin)</div>
                      <div class="text-[11px] text-slate-400">拥有全量供应商、Key签发与数据库管控权</div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="developer">
                    <div class="py-1">
                      <div class="font-bold text-slate-800">智能算法工程师 (developer)</div>
                      <div class="text-[11px] text-slate-400">聚焦应用接入、沙箱测试与日志调试</div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="finance">
                    <div class="py-1">
                      <div class="font-bold text-slate-800">财务精算审计 (finance)</div>
                      <div class="text-[11px] text-slate-400">专注成本分摊、部门账单与用量核算</div>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <!-- Notification Bell -->
          <el-badge :value="3" class="cursor-pointer" type="danger">
            <el-button circle :icon="Bell" size="small" />
          </el-badge>

          <!-- User Info Dropdown -->
          <el-dropdown trigger="click">
            <div class="flex items-center gap-2 cursor-pointer pl-2 border-l border-slate-200">
              <el-avatar :size="32" :src="currentUser.avatar" />
              <div class="hidden lg:block text-left">
                <div class="text-xs font-semibold text-slate-800 leading-tight">{{ currentUser.name }}</div>
                <div class="text-[10px] text-slate-400">@{{ currentUser.username || 'admin' }} · {{ currentUser.department }}</div>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div class="text-xs">
                    <div><strong>{{ currentUser.name }}</strong> (@{{ currentUser.username }})</div>
                    <div class="text-slate-400 text-[10px]">{{ currentUser.roleLabel }} · {{ currentUser.department }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided @click="openSelfProfileModal">
                  <el-icon><EditPen /></el-icon> 个人资料与修改密码
                </el-dropdown-item>
                <el-dropdown-item @click="store.currentView = 'users'">
                  <el-icon><UserFilled /></el-icon> 用户与账号权限管理
                </el-dropdown-item>
                <el-dropdown-item @click="openSwitchUserModal">
                  <el-icon><User /></el-icon> 快捷切换身份账号
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon class="text-rose-500"><SwitchButton /></el-icon>
                  <span class="text-rose-600">退出登录回到登录页</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content Views -->
      <el-main class="p-6 overflow-y-auto">
        <transition name="fade" mode="out-in">
          <component :is="activeComponent" />
        </transition>
      </el-main>
    </el-container>

    <!-- Dialog: Self Profile & Edit Password Modal -->
    <el-dialog
      v-model="selfProfileModalVisible"
      title="修改个人账号资料与头像"
      width="560px"
      destroy-on-close
    >
      <el-form label-position="top" class="space-y-4">
        <!-- Avatar Modification & Database Upload Card -->
        <div class="p-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <!-- Avatar Preview with upload badge -->
            <div class="relative group cursor-pointer shrink-0" @click="triggerProfileFileInput">
              <el-avatar :size="68" :src="selfProfileForm.avatar" class="border-2 border-indigo-200 shadow-xs">
                <el-icon :size="28"><UserFilled /></el-icon>
              </el-avatar>
              <div class="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <el-icon :size="18"><UploadFilled /></el-icon>
                <span class="text-[9px] mt-0.5 font-medium">更换</span>
              </div>
            </div>

            <!-- Upload Info & Controls -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-slate-800 text-sm">{{ currentUser.name }}</span>
                <el-tag size="small" type="primary" effect="light" round>{{ currentUser.roleLabel }}</el-tag>
                <el-tag size="small" type="success" effect="plain" round class="font-mono text-[10px]">
                  存储协议: 数据库持久化
                </el-tag>
              </div>
              <p class="text-xs text-slate-500 mt-1">
                支持上传本地图片文件（JPG、PNG、WebP），系统将自动压缩转码并存入数据库。
              </p>

              <!-- Upload Actions -->
              <div class="mt-2.5 flex items-center gap-2 flex-wrap">
                <input
                  ref="profileFileInputRef"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  class="hidden"
                  @change="handleProfileAvatarFileChange"
                />
                <el-button
                  type="primary"
                  size="small"
                  :icon="UploadFilled"
                  :loading="isAvatarUploading"
                  @click="triggerProfileFileInput"
                >
                  上传本地头像
                </el-button>
                <el-button
                  size="small"
                  @click="showPresetAvatars = !showPresetAvatars"
                >
                  {{ showPresetAvatars ? '收起预设' : '快捷挑选系统头像' }}
                </el-button>
                <el-button
                  v-if="selfProfileForm.avatar !== defaultAvatar"
                  text
                  size="small"
                  type="info"
                  @click="resetToDefaultAvatar"
                >
                  恢复默认
                </el-button>
              </div>

              <!-- Upload Drag & Drop Dropzone -->
              <div
                class="mt-2.5 px-3 py-2 border border-dashed rounded-lg text-center transition-colors text-xs"
                :class="isDragging ? 'border-indigo-500 bg-indigo-50/60 text-indigo-700' : 'border-slate-300 bg-white/70 text-slate-500'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleProfileAvatarDrop"
              >
                <span v-if="avatarUploadStatus" class="text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <el-icon><Check /></el-icon> {{ avatarUploadStatus }}
                </span>
                <span v-else class="flex items-center justify-center gap-1">
                  <el-icon><PictureFilled /></el-icon> 也可直接将本地头像图片文件拖拽至此处
                </span>
              </div>
            </div>
          </div>

          <!-- Preset Avatars Selector -->
          <div v-if="showPresetAvatars" class="mt-3 pt-3 border-t border-slate-200/80">
            <div class="text-[11px] font-medium text-slate-500 mb-2">点击挑选系统预置头像库：</div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <div
                v-for="(pAvatar, idx) in PRESET_AVATARS"
                :key="idx"
                class="relative cursor-pointer rounded-full p-0.5 border-2 transition-all hover:scale-105"
                :class="selfProfileForm.avatar === pAvatar ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-slate-300'"
                @click="selectPresetAvatar(pAvatar)"
              >
                <el-avatar :size="38" :src="pAvatar" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <el-form-item label="登录账号 (Username)" required>
            <el-input v-model="selfProfileForm.username" placeholder="登录账号" />
          </el-form-item>

          <el-form-item label="真实姓名" required>
            <el-input v-model="selfProfileForm.name" placeholder="真实姓名" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <el-form-item label="电子邮箱" required>
            <el-input v-model="selfProfileForm.email" placeholder="邮箱" />
          </el-form-item>

          <el-form-item label="手机号码">
            <el-input v-model="selfProfileForm.phone" placeholder="手机号" />
          </el-form-item>
        </div>

        <div class="pt-2 border-t border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <el-icon class="text-indigo-600"><Lock /></el-icon>
              修改登录密码
            </span>
            <el-checkbox v-model="selfProfileForm.modifyPassword" class="!text-xs">
              我要修改密码
            </el-checkbox>
          </div>

          <div v-if="selfProfileForm.modifyPassword" class="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <el-form-item label="原密码" required class="!mb-2">
              <el-input
                v-model="selfProfileForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入当前账号原密码"
              />
            </el-form-item>

            <div class="grid grid-cols-2 gap-2">
              <el-form-item label="新密码" required class="!mb-0">
                <el-input
                  v-model="selfProfileForm.newPassword"
                  type="password"
                  show-password
                  placeholder="至少 6 位密码"
                />
              </el-form-item>

              <el-form-item label="确认新密码" required class="!mb-0">
                <el-input
                  v-model="selfProfileForm.confirmNewPassword"
                  type="password"
                  show-password
                  placeholder="确认新密码"
                />
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <el-button @click="selfProfileModalVisible = false">取消</el-button>
          <el-button type="primary" class="!bg-indigo-600 !border-indigo-600" @click="saveSelfProfile">
            保存资料与头像
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Dialog: Switch User Fast Modal -->
    <el-dialog v-model="switchUserModalVisible" title="切换平台用户身份登录" width="480px">
      <div class="space-y-3">
        <div class="text-xs text-slate-500">
          点击选择要登录的组织成员账号（支持多角色权限快速切换）：
        </div>

        <div
          v-for="user in store.users"
          :key="user.id"
          class="p-3 rounded-xl border cursor-pointer transition flex items-center justify-between"
          :class="currentUser.id === user.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50'"
          @click="selectUser(user)"
        >
          <div class="flex items-center gap-3">
            <el-avatar :size="38" :src="user.avatar" />
            <div>
              <div class="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                {{ user.name }}
                <span class="text-xs text-slate-400 font-normal font-mono">@{{ user.username }}</span>
                <span v-if="currentUser.id === user.id" class="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded font-medium">当前</span>
              </div>
              <div class="text-xs text-slate-500">{{ user.department }} · {{ user.roleLabel }}</div>
            </div>
          </div>
          <el-tag :type="user.role === 'admin' ? 'danger' : user.role === 'developer' ? 'success' : 'warning'" size="small">
            {{ user.role }}
          </el-tag>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="switchUserModalVisible = false">完成</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { store, currentUser, setCurrentUser, logoutUser, saveUser, PRESET_AVATARS, compressAndConvertImageToBase64 } from './store/maasStore';
import type { User as UserType, UserRole } from './types';
import { ElMessage } from 'element-plus';

// Icons
import {
  Odometer,
  Connection,
  Key,
  Monitor,
  Money,
  ChatDotSquare,
  Coin,
  Expand,
  Fold,
  ArrowDown,
  Bell,
  UserFilled,
  User,
  SwitchButton,
  EditPen,
  Lock,
  UploadFilled,
  PictureFilled,
  Check,
} from '@element-plus/icons-vue';

// Views
import OverviewView from './components/OverviewView.vue';
import ProvidersView from './components/ProvidersView.vue';
import ApiKeysView from './components/ApiKeysView.vue';
import MonitoringView from './components/MonitoringView.vue';
import CostBillingView from './components/CostBillingView.vue';
import PlaygroundView from './components/PlaygroundView.vue';
import UsersView from './components/UsersView.vue';
import LoginView from './components/LoginView.vue';

const isCollapse = ref(false);
const switchUserModalVisible = ref(false);
const selfProfileModalVisible = ref(false);

const profileFileInputRef = ref<HTMLInputElement | null>(null);
const isAvatarUploading = ref(false);
const isDragging = ref(false);
const showPresetAvatars = ref(false);
const avatarUploadStatus = ref('');
const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80';

const selfProfileForm = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  avatar: '',
  modifyPassword: false,
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const activeComponent = computed(() => {
  switch (store.currentView) {
    case 'overview':
      return OverviewView;
    case 'providers':
      return ProvidersView;
    case 'apikeys':
      return ApiKeysView;
    case 'monitoring':
      return MonitoringView;
    case 'billing':
      return CostBillingView;
    case 'playground':
      return PlaygroundView;
    case 'users':
      return UsersView;
    case 'login':
      return LoginView;
    default:
      return OverviewView;
  }
});

const currentViewTitle = computed(() => {
  switch (store.currentView) {
    case 'overview':
      return '治理运行大盘';
    case 'providers':
      return '大模型供应商管理';
    case 'apikeys':
      return '统一 API Key 网关分发';
    case 'monitoring':
      return '细粒度调用审计流水';
    case 'billing':
      return '算力费用与成本核算';
    case 'playground':
      return '在线模型推理沙箱';
    case 'users':
      return '用户与账号权限管理';
    case 'login':
      return 'MaaS 登录界面';
    default:
      return '治理运行大盘';
  }
});

const currentRoleLabel = computed(() => {
  if (store.activeRole === 'admin') return '平台超级管理员 (admin)';
  if (store.activeRole === 'developer') return '智能算法工程师 (developer)';
  return '财务审计总监 (finance)';
});

function handleMenuSelect(index: string) {
  store.currentView = index as any;
}

function handleRoleChange(role: string) {
  store.activeRole = role as UserRole;
  const targetUser = store.users.find(u => u.role === role);
  if (targetUser) {
    setCurrentUser(targetUser);
  } else {
    currentUser.role = role as UserRole;
  }
  ElMessage.success(`已切换至【${currentRoleLabel.value}】权限视角`);
}

function handleLogout() {
  logoutUser();
  ElMessage.info('已退出登录，欢迎回到登录界面');
}

function openSwitchUserModal() {
  switchUserModalVisible.value = true;
}

function selectUser(u: UserType) {
  setCurrentUser(u);
  switchUserModalVisible.value = false;
  ElMessage.success(`欢迎您，${u.name}！已切换到账号 @${u.username}`);
}

function openSelfProfileModal() {
  selfProfileForm.username = currentUser.username || '';
  selfProfileForm.name = currentUser.name || '';
  selfProfileForm.email = currentUser.email || '';
  selfProfileForm.phone = currentUser.phone || '';
  selfProfileForm.avatar = currentUser.avatar || defaultAvatar;
  selfProfileForm.modifyPassword = false;
  selfProfileForm.oldPassword = '';
  selfProfileForm.newPassword = '';
  selfProfileForm.confirmNewPassword = '';
  avatarUploadStatus.value = '';
  showPresetAvatars.value = false;
  isDragging.value = false;
  selfProfileModalVisible.value = true;
}

function triggerProfileFileInput() {
  profileFileInputRef.value?.click();
}

async function handleProfileAvatarFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    await processAvatarFile(file);
  }
  // Reset input so re-selecting same file triggers change
  target.value = '';
}

async function handleProfileAvatarDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await processAvatarFile(file);
  }
}

async function processAvatarFile(file: File) {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择有效的图片文件 (JPG, PNG, WebP, GIF)！');
    return;
  }
  try {
    isAvatarUploading.value = true;
    const base64DataUrl = await compressAndConvertImageToBase64(file, 300, 0.88);
    selfProfileForm.avatar = base64DataUrl;
    avatarUploadStatus.value = `已读取文件 ${file.name} (${(file.size / 1024).toFixed(1)} KB)，已压缩转码待存入数据库`;
    ElMessage.success('本地头像图片已成功上传并转码，点击下方“保存”将持久化存入数据库！');
  } catch (err: any) {
    ElMessage.error(err.message || '图片上传处理失败，请重试');
  } finally {
    isAvatarUploading.value = false;
  }
}

function selectPresetAvatar(url: string) {
  selfProfileForm.avatar = url;
  avatarUploadStatus.value = '已选择系统预置头像';
  ElMessage.info('已选定系统预置头像，点击保存后生效');
}

function resetToDefaultAvatar() {
  selfProfileForm.avatar = defaultAvatar;
  avatarUploadStatus.value = '已恢复系统初始头像';
}

function saveSelfProfile() {
  if (!selfProfileForm.username.trim()) {
    ElMessage.error('账号名称不能为空！');
    return;
  }
  if (!selfProfileForm.name.trim()) {
    ElMessage.error('真实姓名不能为空！');
    return;
  }
  if (!selfProfileForm.email.trim()) {
    ElMessage.error('电子邮箱不能为空！');
    return;
  }

  // If modifying password
  if (selfProfileForm.modifyPassword) {
    if (currentUser.password && selfProfileForm.oldPassword !== currentUser.password) {
      ElMessage.error('原密码输入不正确！');
      return;
    }
    if (!selfProfileForm.newPassword || selfProfileForm.newPassword.length < 6) {
      ElMessage.error('新密码长度不能少于 6 位！');
      return;
    }
    if (selfProfileForm.newPassword !== selfProfileForm.confirmNewPassword) {
      ElMessage.error('两次输入的新密码不一致！');
      return;
    }
  }

  // Update current user fields including avatar
  currentUser.username = selfProfileForm.username.trim();
  currentUser.name = selfProfileForm.name.trim();
  currentUser.email = selfProfileForm.email.trim();
  currentUser.phone = selfProfileForm.phone.trim();
  currentUser.avatar = selfProfileForm.avatar;
  if (selfProfileForm.modifyPassword && selfProfileForm.newPassword) {
    currentUser.password = selfProfileForm.newPassword;
  }

  // Save and persist to database
  saveUser(currentUser);

  selfProfileModalVisible.value = false;
  ElMessage.success('个人资料与头像已成功保存，并已持久化存入数据库！');
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
