<script setup lang="ts">
import { shallowRef, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useTabsStore } from '@/stores/tabs'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import TabsView from './TabsView.vue'

interface MenuItem {
  path: string
  title: string
  icon: string
  children?: MenuItem[]
}

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tabsStore = useTabsStore()

// 菜单配置，通过 provide 注入给 Sidebar
const menuItems = shallowRef<MenuItem[]>([

  { path: '/channel', title: '频道管理', icon: 'Link' },
  { path: '/categories', title: '栏目管理', icon: 'Memo' },
  { path: '/content', title: '内容管理', icon: 'Document' },
  { path: '/user', title: '账号管理', icon: 'User' },
  // {
  //   path: '/system',
  //   title: '系统管理',
  //   icon: 'Setting',
  //   children: [
  //     { path: '/system/users', title: '用户管理', icon: 'User' },
  //     { path: '/system/roles', title: '角色管理', icon: 'Avatar' },
  //     { path: '/system/permissions', title: '权限管理', icon: 'Lock' },
  //   ],
  // },
  // {
  //   path: '/content',
  //   title: '内容管理',
  //   icon: 'Document',
  //   children: [
  //     { path: '/content/articles', title: '文章管理', icon: 'Notebook' },
  //     { path: '/content/categories', title: '分类管理', icon: 'Folder' },
  //   ],
  // },
  // { path: '/settings', title: '个人设置', icon: 'Tools' },
])

provide('menuItems', menuItems)

// 监听路由变化，添加 tab
watch(
  () => route.path,
  () => {
    tabsStore.addTab(route)
  },
  { immediate: true }
)

// 监听 tabs 激活变化，切换路由
watch(
  () => tabsStore.activeTab,
  (path) => {
    if (path !== route.path) {
      router.push(path)
    }
  }
)
</script>

<template>
  <el-container class="main-layout">
    <el-aside :width="appStore.sidebarWidth" class="sidebar-aside">
      <div class="logo">
        <span v-show="!appStore.isCollapse">管理后台</span>
        <span v-show="appStore.isCollapse">Admin</span>
      </div>
      <Sidebar />
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <Header />
      </el-header>

      <TabsView />

      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <keep-alive :include="tabsStore.tabs.map(t => t.name)">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main-layout {
  height: 100vh;
}

.sidebar-aside {
  background-color: #161618;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #0d0d0e;
}

.layout-header {
  height: 60px;
  padding: 0;
}

.layout-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>