<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { Fold, Expand, UserFilled, SwitchButton } from '@element-plus/icons-vue'
import PasswordDialog from './PasswordDialog.vue'
import { logout } from "@/api"
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const pageTitle = computed(() => route.meta?.title ?? '')

const passwordDialogRef = shallowRef<InstanceType<typeof PasswordDialog>>()

function openPasswordDialog() {
  passwordDialogRef.value?.open()
}
const exit = () => {
  logout({}).then(() => {
    userStore.logout()
  }).catch((error) => {
    ElMessage.error(error.message || '退出登录失败')
  })
}
</script>

<template>
  <div class="header-container">
    <div class="header-left">
      <el-icon class="collapse-icon" @click="appStore.toggleCollapse">
        <Fold v-if="!appStore.isCollapse" />
        <Expand v-else />
      </el-icon>
      <span class="page-title">{{ pageTitle }}</span>
    </div>

    <div class="header-right">
      <el-dropdown>
        <div class="user-info">
          <el-avatar :size="32" :icon="UserFilled" />
          <span class="user-name">{{ userStore.userInfo?.name ?? '用户' }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="openPasswordDialog">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="exit">
              <el-icon>
                <SwitchButton />
              </el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 修改密码弹窗 -->
    <PasswordDialog ref="passwordDialogRef" />
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-icon {
  cursor: pointer;
  font-size: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-name {
  font-size: 14px;
}
</style>