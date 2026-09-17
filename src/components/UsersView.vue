<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <el-icon :size="20"><UserFilled /></el-icon>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              用户与账号权限管理
              <span class="text-xs px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                {{ store.users.length }} 位成员
              </span>
            </h1>
            <p class="text-xs text-slate-500 mt-1">
              集中管理 MaaS 平台用户账号、安全密码、角色权限 (RBAC)、归属部门与月度算力调用预算配额
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <el-button @click="handleBatchExport" plain>
          <el-icon class="mr-1"><Download /></el-icon> 导出用户清单
        </el-button>
        <el-button type="primary" class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700 shadow-xs" @click="openCreateModal">
          <el-icon class="mr-1"><Plus /></el-icon> 新建平台用户
        </el-button>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-medium">总注册账号</span>
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <el-icon :size="16"><User /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ store.users.length }}</div>
        <div class="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <span class="text-emerald-600 font-medium">{{ activeUsersCount }} 正常启用</span>
          <span>·</span>
          <span class="text-amber-600 font-medium">{{ disabledUsersCount }} 冻结锁定</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-medium">超级平台管理员 (Admin)</span>
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <el-icon :size="16"><Setting /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ adminUsersCount }}</div>
        <div class="text-xs text-slate-400 mt-1">最高架构管控与供应商配置特权</div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-medium">算法与研发工程师 (Dev)</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <el-icon :size="16"><Cpu /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ devUsersCount }}</div>
        <div class="text-xs text-slate-400 mt-1">模型调用、API Key 生成与沙箱调试</div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-medium">月度算力配额资金池</span>
          <div class="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <el-icon :size="16"><Money /></el-icon>
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 font-mono">¥{{ totalQuotaCny.toLocaleString() }}</div>
        <div class="text-xs text-slate-400 mt-1">企业全员模型调用算力月度上限</div>
      </div>
    </div>

    <!-- Filter and Search Bar -->
    <div class="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3 flex-1">
        <el-input
          v-model="searchKeyword"
          placeholder="按登录账号、真实姓名、部门或邮箱检索..."
          clearable
          class="!w-72"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="filterRole" placeholder="角色权限" clearable class="!w-36">
          <el-option label="全部角色" value="" />
          <el-option label="超级管理员" value="admin" />
          <el-option label="研发工程师" value="developer" />
          <el-option label="财务总监" value="finance" />
        </el-select>

        <el-select v-model="filterStatus" placeholder="账号状态" clearable class="!w-32">
          <el-option label="全部状态" value="" />
          <el-option label="正常启用" value="active" />
          <el-option label="冻结禁用" value="disabled" />
        </el-select>
      </div>

      <div class="flex items-center gap-2">
        <el-tag type="info" effect="plain" class="!text-slate-500">
          已筛选出 {{ filteredUsers.length }} 条记录
        </el-tag>
        <el-button text @click="resetFilters">
          <el-icon class="mr-1"><Refresh /></el-icon> 重置筛选
        </el-button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <el-table :data="filteredUsers" stripe style="width: 100%" class="maas-user-table">
        <el-table-column label="用户 / 登录账号" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3 py-1">
              <el-avatar :size="38" :src="row.avatar" class="border border-slate-200 shrink-0">
                {{ row.name.slice(0, 1) }}
              </el-avatar>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="font-semibold text-slate-800 text-sm truncate">{{ row.name }}</span>
                  <span v-if="currentUser.id === row.id" class="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded font-medium">当前</span>
                </div>
                <div class="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <span>@{{ row.username }}</span>
                  <el-tooltip content="点击复制账号" placement="top">
                    <button @click="copyText(row.username, '账号已复制')" class="hover:text-indigo-600 transition-colors">
                      <el-icon :size="11"><CopyDocument /></el-icon>
                    </button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="角色权限" width="130">
          <template #default="{ row }">
            <el-tag
              :type="getRoleTagType(row.role)"
              effect="light"
              round
              class="font-medium"
            >
              {{ row.roleLabel || getRoleName(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="归属部门 / 组织" min-width="150">
          <template #default="{ row }">
            <div class="text-xs text-slate-700 font-medium">{{ row.department }}</div>
            <div class="text-[11px] text-slate-400 truncate">{{ row.organization || '企业AI调度中心' }}</div>
          </template>
        </el-table-column>

        <el-table-column label="联系方式" min-width="180">
          <template #default="{ row }">
            <div class="text-xs text-slate-600 font-mono flex items-center gap-1">
              <el-icon :size="12" class="text-slate-400"><Message /></el-icon>
              <span class="truncate">{{ row.email }}</span>
            </div>
            <div v-if="row.phone" class="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
              <el-icon :size="11" class="text-slate-400"><Phone /></el-icon>
              <span>{{ row.phone }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="月度算力配额" width="140">
          <template #default="{ row }">
            <div class="text-xs font-mono font-semibold text-slate-800">
              ¥{{ (row.monthlyQuotaCny || 0).toLocaleString() }}
            </div>
            <div class="text-[10px] text-slate-400">上限月度预算</div>
          </template>
        </el-table-column>

        <el-table-column label="账号状态" width="110">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status === 'active'"
              :disabled="row.id === currentUser.id"
              active-color="#10b981"
              inactive-color="#e2e8f0"
              @change="(val) => handleToggleStatus(row, val as boolean)"
            />
            <span class="ml-2 text-xs" :class="row.status === 'active' ? 'text-emerald-600' : 'text-slate-400'">
              {{ row.status === 'active' ? '启用' : '冻结' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="最后登录" width="150">
          <template #default="{ row }">
            <span class="text-xs text-slate-500 font-mono">
              {{ row.lastLoginAt || '未登录过' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <el-button type="primary" link size="small" @click="openEditModal(row)">
                <el-icon class="mr-0.5"><Edit /></el-icon> 编辑账号
              </el-button>
              
              <el-button type="warning" link size="small" @click="openPasswordModal(row)">
                <el-icon class="mr-0.5"><Key /></el-icon> 重置密码
              </el-button>

              <el-popconfirm
                title="确定要彻底删除此用户账号吗？"
                confirm-button-text="删除"
                cancel-button-text="取消"
                confirm-button-type="danger"
                @confirm="handleDeleteUser(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    link
                    size="small"
                    :disabled="row.id === currentUser.id"
                  >
                    <el-icon class="mr-0.5"><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Create or Edit User Modal -->
    <el-dialog
      v-model="userModalVisible"
      :title="isEditMode ? '编辑用户与账号信息' : '新建平台用户'"
      width="600px"
      destroy-on-close
    >
      <el-form :model="userForm" label-position="top" class="space-y-3">
        <!-- User Avatar Upload Section (Stored to Database) -->
        <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <el-icon class="text-indigo-600"><Avatar /></el-icon>
              用户头像配置 (上传文件存入系统数据库)
            </span>
            <el-tag size="small" type="success" effect="plain" class="text-[10px]">
              Base64 数据库持久化
            </el-tag>
          </div>

          <div class="flex items-center gap-4">
            <!-- Avatar Preview with upload badge -->
            <div class="relative group cursor-pointer shrink-0" @click="triggerUserAvatarFileInput">
              <el-avatar :size="60" :src="userForm.avatar" class="border-2 border-indigo-100 shadow-xs">
                {{ userForm.name ? userForm.name.slice(0, 1) : 'U' }}
              </el-avatar>
              <div class="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <el-icon :size="16"><UploadFilled /></el-icon>
                <span class="text-[9px]">上传</span>
              </div>
            </div>

            <!-- Upload Controls -->
            <div class="flex-1 min-w-0">
              <input
                ref="avatarFileInputRef"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                class="hidden"
                @change="handleUserAvatarFileChange"
              />
              <div class="flex items-center gap-2 flex-wrap">
                <el-button
                  size="small"
                  type="primary"
                  :icon="UploadFilled"
                  :loading="isAvatarUploading"
                  @click="triggerUserAvatarFileInput"
                >
                  上传本地头像图片
                </el-button>
                <el-button
                  size="small"
                  @click="showPresetAvatars = !showPresetAvatars"
                >
                  {{ showPresetAvatars ? '收起预设' : '挑选预设头像' }}
                </el-button>
                <el-button
                  v-if="userForm.avatar"
                  text
                  size="small"
                  type="info"
                  @click="resetUserAvatarToDefault"
                >
                  重置
                </el-button>
              </div>

              <!-- Drag & Drop hint box -->
              <div
                class="mt-2 px-3 py-1.5 border border-dashed rounded-md text-center text-[11px] transition-colors"
                :class="isDragging ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-300 bg-white text-slate-500'"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleUserAvatarDrop"
              >
                <span v-if="avatarUploadStatus" class="text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <el-icon><Check /></el-icon> {{ avatarUploadStatus }}
                </span>
                <span v-else class="flex items-center justify-center gap-1">
                  <el-icon><PictureFilled /></el-icon> 支持点击选择文件或直接拖入本地图片 (JPG/PNG/WebP)
                </span>
              </div>
            </div>
          </div>

          <!-- Preset avatars row -->
          <div v-if="showPresetAvatars" class="mt-2.5 pt-2.5 border-t border-slate-200">
            <div class="text-[11px] text-slate-500 mb-1.5">系统精选头像推荐：</div>
            <div class="flex items-center gap-2 flex-wrap">
              <div
                v-for="(pAvatar, idx) in PRESET_AVATARS"
                :key="idx"
                class="cursor-pointer rounded-full p-0.5 border-2 transition-all hover:scale-105"
                :class="userForm.avatar === pAvatar ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-slate-300'"
                @click="selectUserPresetAvatar(pAvatar)"
              >
                <el-avatar :size="32" :src="pAvatar" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <el-form-item label="登录账号 (Username)" required>
            <el-input
              v-model="userForm.username"
              placeholder="如：dev_zhang"
              :disabled="isEditMode && userForm.id === 'usr-001'"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
            <span class="text-[11px] text-slate-400 mt-1">用于 MaaS 平台系统登录的唯一账号</span>
          </el-form-item>

          <el-form-item label="真实姓名" required>
            <el-input v-model="userForm.name" placeholder="如：张研发">
              <template #prefix>
                <el-icon><Avatar /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- Password input block (always for create, or conditional for edit) -->
        <div v-if="!isEditMode || userForm.changePassword" class="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div class="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <el-icon class="text-indigo-600"><Lock /></el-icon>
            <span>{{ isEditMode ? '修改登录密码' : '设置初始密码' }}</span>
            <button
              type="button"
              @click="generateRandomPassword"
              class="text-[11px] text-indigo-600 hover:text-indigo-700 ml-auto flex items-center gap-1"
            >
              <el-icon :size="11"><Refresh /></el-icon> 随机强密码
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <el-form-item label="输入新密码" required class="!mb-0">
              <el-input
                v-model="userForm.password"
                type="password"
                show-password
                placeholder="至少6位数字字母字符"
              />
            </el-form-item>
            <el-form-item label="确认新密码" required class="!mb-0">
              <el-input
                v-model="userForm.confirmPassword"
                type="password"
                show-password
                placeholder="再次输入新密码"
              />
            </el-form-item>
          </div>
          <!-- Password strength bar -->
          <div v-if="userForm.password" class="mt-2.5 flex items-center gap-2">
            <div class="text-[11px] text-slate-500">密码强度:</div>
            <div class="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                class="h-full transition-all duration-300"
                :class="passwordStrengthColor"
                :style="{ width: passwordStrengthPercent + '%' }"
              ></div>
            </div>
            <span class="text-[11px] font-medium" :class="passwordStrengthTextColor">{{ passwordStrengthLabel }}</span>
          </div>
        </div>

        <div v-else-if="isEditMode" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div class="text-xs text-slate-600">
            <span>当前登录密码：</span>
            <span class="font-mono text-slate-400">••••••••</span>
          </div>
          <el-button type="primary" link size="small" @click="userForm.changePassword = true">
            <el-icon class="mr-1"><EditPen /></el-icon> 更改此用户密码
          </el-button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <el-form-item label="企业电子邮箱" required>
            <el-input v-model="userForm.email" placeholder="name@maas-enterprise.com">
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="手机联系电话">
            <el-input v-model="userForm.phone" placeholder="13800000000">
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <el-form-item label="分配平台角色" required>
            <el-select v-model="userForm.role" class="w-full">
              <el-option label="超级平台管理员 (Admin)" value="admin" />
              <el-option label="研发与算法工程师 (Developer)" value="developer" />
              <el-option label="财务精算审计总监 (Finance)" value="finance" />
            </el-select>
          </el-form-item>

          <el-form-item label="归属部门" required>
            <el-input v-model="userForm.department" placeholder="如：算法研发二部" />
          </el-form-item>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <el-form-item label="月度算力配额 (¥ CNY)">
            <el-input-number
              v-model="userForm.monthlyQuotaCny"
              :min="0"
              :step="1000"
              class="!w-full"
            />
          </el-form-item>

          <el-form-item label="账号状态">
            <el-radio-group v-model="userForm.status" class="mt-1">
              <el-radio value="active">正常启用</el-radio>
              <el-radio value="disabled">冻结锁定</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <el-button @click="userModalVisible = false">取消</el-button>
          <el-button type="primary" class="!bg-indigo-600 !border-indigo-600" @click="handleSaveUser">
            {{ isEditMode ? '保存修改' : '确认创建用户' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Reset Password Dedicated Modal -->
    <el-dialog
      v-model="passwordModalVisible"
      title="重置用户登录密码"
      width="460px"
      destroy-on-close
    >
      <div class="space-y-4">
        <div class="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2.5">
          <el-icon class="text-amber-600 mt-0.5"><Warning /></el-icon>
          <div class="text-xs text-amber-800">
            您正在为用户 <strong class="text-slate-900">{{ targetResetUser?.name }} (@{{ targetResetUser?.username }})</strong> 重置登录密码。重置后，该用户下次需要使用新密码登录。
          </div>
        </div>

        <el-form label-position="top">
          <el-form-item label="设置新密码" required>
            <div class="space-y-2 w-full">
              <el-input
                v-model="resetPasswordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新登录密码"
              >
                <template #append>
                  <el-button @click="generateResetStrongPassword">
                    <el-icon><Refresh /></el-icon> 随机密码
                  </el-button>
                </template>
              </el-input>

              <div v-if="resetPasswordForm.newPassword" class="flex items-center gap-2">
                <div class="text-[11px] text-slate-500">安全性评估:</div>
                <div class="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    class="h-full transition-all duration-300"
                    :class="resetStrengthColor"
                    :style="{ width: resetStrengthPercent + '%' }"
                  ></div>
                </div>
                <span class="text-[11px] font-medium" :class="resetStrengthTextColor">{{ resetStrengthLabel }}</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="确认新密码" required>
            <el-input
              v-model="resetPasswordForm.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入确认新密码"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <el-button @click="passwordModalVisible = false">取消</el-button>
          <el-button type="primary" class="!bg-indigo-600 !border-indigo-600" @click="handleConfirmResetPassword">
            立即重置密码
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  User,
  UserFilled,
  Plus,
  Search,
  Refresh,
  Edit,
  Delete,
  Key,
  Download,
  Lock,
  Message,
  Phone,
  Setting,
  Cpu,
  Money,
  Avatar,
  CopyDocument,
  EditPen,
  Warning,
  UploadFilled,
  PictureFilled,
  Check,
} from '@element-plus/icons-vue';
import { store, currentUser, saveUser, removeUser, PRESET_AVATARS, compressAndConvertImageToBase64 } from '../store/maasStore';
import type { User as UserType, UserRole } from '../types';

const searchKeyword = ref('');
const filterRole = ref('');
const filterStatus = ref('');

// Modal states
const userModalVisible = ref(false);
const isEditMode = ref(false);
const passwordModalVisible = ref(false);
const targetResetUser = ref<UserType | null>(null);

const avatarFileInputRef = ref<HTMLInputElement | null>(null);
const isAvatarUploading = ref(false);
const isDragging = ref(false);
const showPresetAvatars = ref(false);
const avatarUploadStatus = ref('');

const userForm = reactive({
  id: '',
  username: '',
  password: '',
  confirmPassword: '',
  changePassword: false,
  name: '',
  email: '',
  phone: '',
  avatar: '',
  role: 'developer' as UserRole,
  roleLabel: '研发工程师',
  department: '',
  organization: '企业AI算力调度中心',
  status: 'active' as 'active' | 'disabled',
  monthlyQuotaCny: 10000,
});

const resetPasswordForm = reactive({
  newPassword: '',
  confirmPassword: '',
});

// Computed metric stats
const activeUsersCount = computed(() => store.users.filter(u => u.status === 'active').length);
const disabledUsersCount = computed(() => store.users.filter(u => u.status === 'disabled').length);
const adminUsersCount = computed(() => store.users.filter(u => u.role === 'admin').length);
const devUsersCount = computed(() => store.users.filter(u => u.role === 'developer').length);
const totalQuotaCny = computed(() => store.users.reduce((acc, u) => acc + (u.monthlyQuotaCny || 0), 0));

// Filtered list
const filteredUsers = computed(() => {
  return store.users.filter((u) => {
    if (filterRole.value && u.role !== filterRole.value) return false;
    if (filterStatus.value && u.status !== filterStatus.value) return false;
    if (searchKeyword.value.trim()) {
      const q = searchKeyword.value.toLowerCase().trim();
      const matchName = u.name.toLowerCase().includes(q);
      const matchUsername = u.username.toLowerCase().includes(q);
      const matchDept = u.department.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      if (!matchName && !matchUsername && !matchDept && !matchEmail) return false;
    }
    return true;
  });
});

function resetFilters() {
  searchKeyword.value = '';
  filterRole.value = '';
  filterStatus.value = '';
}

function getRoleName(role: UserRole) {
  switch (role) {
    case 'admin': return '超级管理员';
    case 'developer': return '研发工程师';
    case 'finance': return '财务总监';
    default: return '普通用户';
  }
}

function getRoleTagType(role: UserRole): '' | 'success' | 'warning' | 'info' | 'danger' {
  switch (role) {
    case 'admin': return 'danger';
    case 'developer': return 'success';
    case 'finance': return 'warning';
    default: return 'info';
  }
}

// Password strength calculation
function calculateStrength(pwd: string) {
  if (!pwd) return { percent: 0, label: '无', color: 'bg-slate-300', text: 'text-slate-400' };
  let score = 0;
  if (pwd.length >= 6) score += 25;
  if (pwd.length >= 10) score += 25;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 25;
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 25;
  
  if (score <= 25) return { percent: 25, label: '弱 (纯数字或短字符)', color: 'bg-rose-500', text: 'text-rose-600' };
  if (score <= 50) return { percent: 50, label: '中等', color: 'bg-amber-500', text: 'text-amber-600' };
  if (score <= 75) return { percent: 75, label: '良好', color: 'bg-indigo-500', text: 'text-indigo-600' };
  return { percent: 100, label: '极高强密码', color: 'bg-emerald-500', text: 'text-emerald-600' };
}

const passwordStrengthPercent = computed(() => calculateStrength(userForm.password).percent);
const passwordStrengthLabel = computed(() => calculateStrength(userForm.password).label);
const passwordStrengthColor = computed(() => calculateStrength(userForm.password).color);
const passwordStrengthTextColor = computed(() => calculateStrength(userForm.password).text);

const resetStrengthPercent = computed(() => calculateStrength(resetPasswordForm.newPassword).percent);
const resetStrengthLabel = computed(() => calculateStrength(resetPasswordForm.newPassword).label);
const resetStrengthColor = computed(() => calculateStrength(resetPasswordForm.newPassword).color);
const resetStrengthTextColor = computed(() => calculateStrength(resetPasswordForm.newPassword).text);

function generateRandomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let res = '';
  for (let i = 0; i < 12; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  userForm.password = res;
  userForm.confirmPassword = res;
  ElMessage.success('已自动生成高强度安全随机密码！');
}

function generateResetStrongPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let res = '';
  for (let i = 0; i < 12; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  resetPasswordForm.newPassword = res;
  resetPasswordForm.confirmPassword = res;
  ElMessage.success('已随机生成并填充强密码！');
}

function copyText(text: string, msg: string) {
  navigator.clipboard.writeText(text);
  ElMessage.success(msg);
}

// Status toggle
function handleToggleStatus(row: UserType, active: boolean) {
  if (row.id === currentUser.id) {
    ElMessage.warning('不能禁用当前正在使用的登录账号！');
    return;
  }
  row.status = active ? 'active' : 'disabled';
  ElMessage.success(`用户 ${row.name} 账号已${active ? '恢复启用' : '冻结锁定'}`);
}

function triggerUserAvatarFileInput() {
  avatarFileInputRef.value?.click();
}

async function handleUserAvatarFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    await processUserAvatarFile(file);
  }
  target.value = '';
}

async function handleUserAvatarDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await processUserAvatarFile(file);
  }
}

async function processUserAvatarFile(file: File) {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择有效的图片文件 (JPG, PNG, WebP, GIF)！');
    return;
  }
  try {
    isAvatarUploading.value = true;
    const base64Data = await compressAndConvertImageToBase64(file, 300, 0.88);
    userForm.avatar = base64Data;
    avatarUploadStatus.value = `已读取 ${file.name} (${(file.size / 1024).toFixed(1)} KB)，已压缩待存入数据库`;
    ElMessage.success('头像文件解析成功并自动完成压缩，点击保存即可存入数据库！');
  } catch (err: any) {
    ElMessage.error(err.message || '图片读取失败，请重试');
  } finally {
    isAvatarUploading.value = false;
  }
}

function selectUserPresetAvatar(url: string) {
  userForm.avatar = url;
  avatarUploadStatus.value = '已选定预置系统头像';
  ElMessage.info('已选定预置头像');
}

function resetUserAvatarToDefault() {
  userForm.avatar = PRESET_AVATARS[3];
  avatarUploadStatus.value = '已重置默认头像';
}

// Modal actions
function openCreateModal() {
  isEditMode.value = false;
  userForm.id = `usr-${Date.now().toString().slice(-4)}`;
  userForm.username = '';
  userForm.password = '';
  userForm.confirmPassword = '';
  userForm.changePassword = true;
  userForm.name = '';
  userForm.email = '';
  userForm.phone = '';
  userForm.avatar = PRESET_AVATARS[3];
  userForm.role = 'developer';
  userForm.roleLabel = '研发工程师';
  userForm.department = '算法研发部';
  userForm.organization = '企业AI算力调度中心';
  userForm.status = 'active';
  userForm.monthlyQuotaCny = 10000;
  avatarUploadStatus.value = '';
  showPresetAvatars.value = false;
  isDragging.value = false;
  userModalVisible.value = true;
}

function openEditModal(row: UserType) {
  isEditMode.value = true;
  userForm.id = row.id;
  userForm.username = row.username;
  userForm.password = row.password || '';
  userForm.confirmPassword = row.password || '';
  userForm.changePassword = false;
  userForm.name = row.name;
  userForm.email = row.email;
  userForm.phone = row.phone || '';
  userForm.avatar = row.avatar || PRESET_AVATARS[3];
  userForm.role = row.role;
  userForm.roleLabel = row.roleLabel;
  userForm.department = row.department;
  userForm.organization = row.organization;
  userForm.status = row.status;
  userForm.monthlyQuotaCny = row.monthlyQuotaCny || 0;
  avatarUploadStatus.value = '';
  showPresetAvatars.value = false;
  isDragging.value = false;
  userModalVisible.value = true;
}

function handleSaveUser() {
  if (!userForm.username.trim()) {
    ElMessage.error('请输入登录账号 (Username)');
    return;
  }
  if (!userForm.name.trim()) {
    ElMessage.error('请输入真实姓名');
    return;
  }
  if (!userForm.email.trim()) {
    ElMessage.error('请输入企业电子邮箱');
    return;
  }

  // Check username uniqueness if creating or changing
  const duplicate = store.users.find(u => u.username.toLowerCase() === userForm.username.trim().toLowerCase() && u.id !== userForm.id);
  if (duplicate) {
    ElMessage.error(`登录账号 "${userForm.username}" 已存在，请更换！`);
    return;
  }

  // Validate password
  if (!isEditMode.value || userForm.changePassword) {
    if (!userForm.password || userForm.password.length < 6) {
      ElMessage.error('密码长度至少为 6 位字符！');
      return;
    }
    if (userForm.password !== userForm.confirmPassword) {
      ElMessage.error('两次输入的密码不一致，请核对！');
      return;
    }
  }

  const roleLabelMap: Record<UserRole, string> = {
    admin: '超级平台管理员',
    developer: '研发工程师',
    finance: '财务总监',
  };

  const payload: UserType = {
    id: userForm.id,
    username: userForm.username.trim(),
    password: (!isEditMode.value || userForm.changePassword) ? userForm.password : (store.users.find(u => u.id === userForm.id)?.password || 'password123'),
    name: userForm.name.trim(),
    email: userForm.email.trim(),
    phone: userForm.phone.trim(),
    avatar: userForm.avatar,
    role: userForm.role,
    roleLabel: roleLabelMap[userForm.role] || '平台成员',
    department: userForm.department.trim(),
    organization: userForm.organization.trim(),
    status: userForm.status,
    monthlyQuotaCny: userForm.monthlyQuotaCny,
    lastLoginAt: isEditMode.value ? (store.users.find(u => u.id === userForm.id)?.lastLoginAt || '') : '',
    createdAt: isEditMode.value ? (store.users.find(u => u.id === userForm.id)?.createdAt || '') : new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  saveUser(payload, !isEditMode.value);
  userModalVisible.value = false;
  ElMessage.success(isEditMode.value ? `用户 ${payload.name} 账号与头像已更新并存入数据库！` : `新用户 ${payload.name} 创建成功并已存入数据库！`);
}

// Reset password dedicated modal
function openPasswordModal(row: UserType) {
  targetResetUser.value = row;
  resetPasswordForm.newPassword = '';
  resetPasswordForm.confirmPassword = '';
  passwordModalVisible.value = true;
}

function handleConfirmResetPassword() {
  if (!targetResetUser.value) return;
  if (!resetPasswordForm.newPassword || resetPasswordForm.newPassword.length < 6) {
    ElMessage.error('新密码长度不能少于 6 位！');
    return;
  }
  if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致！');
    return;
  }

  targetResetUser.value.password = resetPasswordForm.newPassword;
  if (currentUser.id === targetResetUser.value.id) {
    currentUser.password = resetPasswordForm.newPassword;
  }
  passwordModalVisible.value = false;
  ElMessage.success(`用户 ${targetResetUser.value.name} 的登录密码已重置生效！`);
}

// Delete user
function handleDeleteUser(row: UserType) {
  if (row.id === currentUser.id) {
    ElMessage.error('无法删除当前登录的账号！');
    return;
  }
  const ok = removeUser(row.id);
  if (ok) {
    ElMessage.success(`用户 ${row.name} 已被彻底删除`);
  } else {
    ElMessage.error('删除用户失败');
  }
}

// Batch export
function handleBatchExport() {
  const jsonStr = JSON.stringify(store.users, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `maas-users-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  ElMessage.success('用户数据已导出为 JSON 清单');
}
</script>

<style scoped>
:deep(.maas-user-table .el-table__header th) {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 12px;
}
</style>
