<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const tabsStore = useTabsStore()

const activeTab = computed({
  get: () => tabsStore.activeTab,
  set: (val) => tabsStore.setActiveTab(val),
})

function handleTabClick(tab: { paneName: string }) {
  router.push(tab.paneName)
}

function handleTabRemove(path: string) {
  const isActive = tabsStore.activeTab === path
  tabsStore.closeTab(path)
  if (isActive) {
    router.push(tabsStore.activeTab)
  }
}
</script>

<template>
  <div class="tabs-view">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="tabs-container"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        :closable="tab.closable"
      />
    </el-tabs>

    <el-dropdown class="tabs-dropdown" trigger="click">
      <el-button type="primary" link>
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="tabsStore.closeOtherTabs(activeTab)">
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item @click="tabsStore.closeAllTabs">
            关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.tabs-view {
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.tabs-container {
  flex: 1;
  height: 36px;
}

.tabs-container :deep(.el-tabs__header) {
  margin: 0;
  height: 36px;
}

.tabs-container :deep(.el-tabs__nav) {
  border: none;
}

.tabs-container :deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  margin-right: 4px;
  padding: 0 12px;
  border: 1px solid #d8dce5;
  border-radius: 2px;
  background-color: #fff;
}

.tabs-container :deep(.el-tabs__item.is-active) {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}

.tabs-container :deep(.el-tabs__item:hover) {
  color: #409eff;
}

.tabs-container :deep(.el-tabs__item.is-active:hover) {
  color: #fff;
}

.tabs-dropdown {
  margin-left: 10px;
}
</style>