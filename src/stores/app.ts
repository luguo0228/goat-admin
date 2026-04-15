import { defineStore } from 'pinia'
import { shallowRef, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isCollapse = shallowRef(false)
  const device = shallowRef<'desktop' | 'mobile'>('desktop')

  const sidebarWidth = computed(() => isCollapse.value ? 64 : 220)

  function toggleCollapse() {
    isCollapse.value = !isCollapse.value
  }

  function setDevice(newDevice: 'desktop' | 'mobile') {
    device.value = newDevice
  }

  return {
    isCollapse,
    device,
    sidebarWidth,
    toggleCollapse,
    setDevice,
  }
})