<template>
    <div class="users-page">
        <!-- 数据表格卡片 -->
        <div class="table-card">
            <!-- 搜索栏 -->
            <div class="table-toolbar">
                <div class="search-wrapper">
                   
                </div>
                <div class="toolbar-right">
                    <el-button type="primary" @click="open()">
                        <span>分发</span>
                    </el-button>
                </div>
            </div>

            <div class="main">
                <!-- Element Plus 表格 -->
                <el-table :data="state.list" v-loading="loading" stripe class="custom-table"
                    :header-cell-style="{ background: '#fafbfc', color: '#64748b', fontWeight: '600' }">

                   
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
                    <el-table-column prop="sort" label="排序"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" width="180">
                        <template #default="{ row }">
                            {{ dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="160" fixed="right">
                        <template #default="{ row }">
                            <div class="action-btns">
                                <el-button @click="handleEditSort(row)" type="primary" size="small">
                                    编辑排序
                                </el-button>
                                <el-popconfirm class="box-item" title="确认删除该数据？" placement="top-start"
                                    @confirm="del(row)">
                                    <template #reference>
                                        <el-button type="danger" size="small">
                                            删除
                                        </el-button>
                                    </template>
                                </el-popconfirm>

                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="state.page" v-model:page-size="state.size"
                        :page-sizes="[10, 20, 50, 100]" :total="state.total"
                        layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
                        @current-change="handlePageChange" />
                </div>
            </div>
        </div>

        <SortDialog ref="sortRef" @change="init" />
        <DispenseDialog ref="dispenseRef"   @change="init"  />
    </div>
</template>
<script setup lang="ts">
import { shallowRef, onMounted, ref, reactive } from 'vue'
import { useRoute } from "vue-router"
import { getColumnContentList, deleteColumnContent } from "@/api/index";
import { ElMessage, dayjs } from 'element-plus';
import { type } from "@/utils/constant"
import SortDialog from './components/sort.vue'
import DispenseDialog from './components/dispense.vue';

const route = useRoute()
const state = reactive({
    page: 1,
    size: 10,
    list: [],
    total: 0,

})

const sortRef = shallowRef<InstanceType<typeof SortDialog>>()
const dispenseRef = shallowRef<InstanceType<typeof DispenseDialog>>()
const loading = ref(true)
onMounted(() => {
    init();
})

// 
const init = async () => {
    loading.value = true
    getColumnContentList({
        page: state.page - 1,
        size: state.size,
        columnId: route.params.id
    }).then((res: any) => {
        state.list = res.content.map((item:any) => {
            return{
                ...item,
                  listId: item.id,
                ...item.content,
              
            }
        });
        state.total = res.total;

    }).finally(() => {
        setTimeout(() => loading.value = false, 500)
    })
}
const dealType = (value: string) => {
    return type.find(item => item.value === value)?.label || ''
}


// 分页变化
const handlePageChange = (page: number) => {
    state.page = page
    init()
}

const handleSizeChange = (size: number) => {
    state.size = size
    state.page = 1
    init()
}

const handleEditSort = (row: any) => {
    sortRef.value?.open(row)
}
const open = () => {
    dispenseRef.value?.open(route.params.id as string);
}
const del = (row: any) => {
    deleteColumnContent({
        id: row.listId   
    }).then(() => {
        ElMessage.success('删除成功')
        init()
    }).catch((error) => {
        ElMessage.error(error.msg)
    })
}

</script>
<style scoped>
.users-page {

    font-family: 'PingFang SC', 'Hiragino Sans GB', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    margin: 0 auto;
    /* padding: 2rem; */
    min-height: 100vh;

}

.table-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    animation: fadeInUp 0.6s ease-out;
}


.table-toolbar {
    display: flex;

    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e2e8f0;
}

.search-wrapper {
    flex: 1;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}



.main {
    padding: 10px;
}
</style>