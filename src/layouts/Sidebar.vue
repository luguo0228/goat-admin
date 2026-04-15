<script setup lang="ts">
import { computed, inject, shallowRef, type ShallowRef, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import {
  Odometer,
  User,
  Link,
  Document,
  Memo
} from '@element-plus/icons-vue'

interface MenuItem {
  path: string
  title: string
  icon: string
  children?: MenuItem[]
}

const route = useRoute()
const appStore = useAppStore()

const menuItems = inject<ShallowRef<MenuItem[]>>('menuItems', shallowRef([]))
const iconMap: Record<string, Component> = {
  Odometer,
  User,
  Link,
  Document,
  Memo
}

const activeMenu = computed(() => route.path)

const defaultOpeneds = computed(() => {
  const paths: string[] = []
  const currentPath = route.path
  console.log('menuItems', menuItems);
  menuItems.value.forEach(item => {
    if (item.children && item.children.some(child => child.path === currentPath)) {
      paths.push(item.path)
    }
  })
  return paths
})
</script>

<template>
  <el-menu :default-active="activeMenu" :default-openeds="defaultOpeneds" :collapse="appStore.isCollapse"
    :collapse-transition="false" router class="sidebar-menu" background-color="#161618" text-color="#fff"
    active-text-color="#409eff">
    <template v-for="item in menuItems" :key="item.path">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="iconMap[item.icon]" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
          <el-icon>
            <component :is="iconMap[child.icon]" />
          </el-icon>
          <template #title>{{ child.title }}</template>
        </el-menu-item>
      </el-sub-menu>

      <!-- 无子菜单 -->
      <el-menu-item v-else :index="item.path">
        <el-icon>
          <component :is="iconMap[item.icon]" />
        </el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
.sidebar-menu {
  border-right: none;
  height: 100%;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}
</style>