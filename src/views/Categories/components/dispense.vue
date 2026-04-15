<template>
    <el-dialog v-model="visible" title="分发" width="850px" :close-on-click-modal="false" @close="handleDialogClose"
        class="user-dialog">
        <div>
            <el-table ref="multipleTableRef" :data="state.list" v-loading="loading" stripe class="custom-table"
                row-key="id" @selection-change="handleSelectionChange"
                :header-cell-style="{ background: '#fafbfc', color: '#64748b', fontWeight: '600' }">
                <el-table-column type="selection" width="55" fixed="left" />
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column prop="type" label="类型">
                    <template #default="{ row }">
                        {{ dealType(row.type) }}
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="图标" width="80">
                    <template #default="{ row }">
                        <el-avatar shape="square" :size="50" :src="row.icon" />
                    </template>
                </el-table-column>
                <el-table-column prop="cover" label="封面图">
                    <template #default="{ row }">
                        <el-avatar shape="square" :size="50" :src="row.cover" />
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="链接" width="200">
                </el-table-column>
                <el-table-column prop="feature" label="特点" width="120">
                </el-table-column>
                <el-table-column prop="introduce" label="介绍说明">
                </el-table-column>
                <el-table-column prop="views" label="观看人数">
                </el-table-column>
                <el-table-column prop="click" label="点击数">
                </el-table-column>
                <el-table-column prop="download" label="下载数">
                </el-table-column>
                <el-table-column prop="display" label="是否显示">
                    <template #default="{ row }">
                        <el-tag :type="row.display ? 'primary' : 'danger'">{{ row.display ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>


            </el-table>
            <div class="pagination-wrapper">
                <el-pagination v-model:current-page="state.page" v-model:page-size="state.size"
                    :page-sizes="[10, 20, 50, 100]" :total="state.total"
                    layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
                    @current-change="handlePageChange" />
            </div>
        </div>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="handleSubmit">
                确定
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { shallowRef, reactive, ref, watch } from 'vue'
// import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { getContentList, distributeColumnContent } from "@/api"
import { type } from "@/utils/constant"
const visible = shallowRef(false)
const loading = ref(false)
// const multipleTableRef = shallowRef<FormInstance>()

const columnId = ref<string | undefined>()
const emit = defineEmits(['change'])
const state = reactive({
    page: 1,
    size: 10,
    list: [],
    total: 0,
    actives: [] as any[],

})
watch(() => visible.value, (val) => {
    if (val) {
        init();
    }
}, {
    immediate: true
})
function init() {
    loading.value = true
    getContentList({
        page: state.page - 1,
        size: state.size,

    }).then((res: any) => {
        state.list = res.content;
        state.total = res.total;
    }).finally(() => {
        setTimeout(() => loading.value = false, 500)
    })
}

const dealType = (value: string) => {
    return type.find(item => item.value === value)?.label || ''
}
function open(id: string) {
    columnId.value = id
    state.actives = [];
    visible.value = true

}

const handleSizeChange = (size: number) => {
    state.size = size
    state.page = 1
    init()
}
const handlePageChange = (page: number) => {
    state.page = page
    init()
}

const handleSelectionChange = (val: any) => {
    state.actives = [];
    val.forEach((item: any) => {
        state.actives.push({
            contentId: item.id,
            sort: item.sort
        });
    })
}
async function handleSubmit() {
    loading.value = true
    distributeColumnContent({ columnId: columnId.value, contents: JSON.stringify(state.actives), }).then(() => {
        ElMessage.success('分发成功')
        emit('change')
    }).catch((error: { msg?: string }) => {
        ElMessage.error(error.msg || '更新失败');

    }).finally(() => {
        visible.value = false
        loading.value = false
    })
}

function handleDialogClose() {
    // formRef.value?.resetFields()
    columnId.value = undefined
}

defineExpose({ open })
</script>