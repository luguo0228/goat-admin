<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
/* ============================================
   Pagination
   ============================================ */
.pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid var(--border-light);
}

.pagination-wrapper :deep(.el-pagination) {
    --el-pagination-bg-color: var(--bg-page);
    --el-pagination-button-bg-color: var(--bg-card);
    --el-pagination-hover-color: var(--primary);
}

.pagination-wrapper :deep(.el-pagination .el-pager li) {
    border-radius: 8px;
    font-weight: 500;
    margin: 0 4px;
}

.pagination-wrapper :deep(.el-pagination .el-pager li.is-active) {
   
    color: white;
}

.pagination-wrapper :deep(.el-pagination button) {
    border-radius: 8px;
}

.pagination-wrapper :deep(.el-pagination .el-select .el-select__wrapper) {
    border-radius: 8px;
}
</style>