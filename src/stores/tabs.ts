import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

interface TabItem {
  path: string
  title: string
  name: string
  closable: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([
    { path: '/channel', title: '频道管理', name: 'Channel', closable: false },
  ])

  const activeTab = ref('/channel')

  const currentTab = computed(() =>
    tabs.value.find(tab => tab.path === activeTab.value)
  )

  function addTab(route: RouteLocationNormalized) {
    const { path, meta, name } = route
    const title = (meta?.title as string) || (typeof name === 'string' ? name : path)

    // 不添加登录页和404页
    if (path === '/login' || path.startsWith('/:pathMatch')) {
      return
    }

    // 检查是否已存在
    const exists = tabs.value.some(tab => tab.path === path)
    if (!exists) {
      tabs.value.push({
        path,
        title,
        name: typeof name === 'string' ? name : path,
        closable: path !== '/dashboard',
      })
    }

    activeTab.value = path
  }

  function closeTab(path: string) {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index === -1) return

    // 仪表盘不可关闭
    if (path === '/dashboard') return

    tabs.value.splice(index, 1)

    // 如果关闭的是当前激活的 tab，切换到上一个或仪表盘
    if (activeTab.value === path) {
      const nextTab = tabs.value[index] || tabs.value[index - 1] || tabs.value[0]
      activeTab.value = nextTab.path
    }
  }

  function closeOtherTabs(path: string) {
    tabs.value = tabs.value.filter(
      tab => tab.path === path || tab.path === '/dashboard'
    )
    activeTab.value = path
  }

  function closeAllTabs() {
    tabs.value = tabs.value.filter(tab => tab.path === '/dashboard')
    activeTab.value = '/dashboard'
  }

  function setActiveTab(path: string) {
    activeTab.value = path
  }

  return {
    tabs,
    activeTab,
    currentTab,
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    setActiveTab,
  }
})